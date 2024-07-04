import os
import shutil
import time

import numpy as np
from PIL import Image, ImageFilter
from tensorflow.keras.preprocessing.image import img_to_array
from pyspark.ml import Pipeline
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.evaluation import MulticlassClassificationEvaluator
from pyspark.ml.linalg import Vectors, VectorUDT
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.types import DoubleType

DATA_PATH = "public/model_data"
TRAIN_PATH = f"{DATA_PATH}/train"
MODEL_PATH = "public/beach_model"


def load_and_clean_image(image_path):
    image = Image.open(image_path)
    return image.filter(ImageFilter.MedianFilter(size=3))


def preprocess_image(image):
    image = image.resize((224, 224))
    image_array = img_to_array(image)
    return np.expand_dims(image_array, axis=0) / 255.0


def image_to_feature_vector(image_path):
    image = load_and_clean_image(image_path)
    preprocessed_image = preprocess_image(image)
    return preprocessed_image.flatten()


def prepare_data(spark, train_path):
    categories = os.listdir(train_path)
    category_to_label = {category: idx for idx, category in enumerate(categories)}
    data = []

    for category in categories:
        category_path = os.path.join(train_path, category)
        image_files = [os.path.join(category_path, f) for f in os.listdir(category_path) if f.endswith(('jpg', 'jpeg', 'png'))]

        for image_file in image_files:
            features = image_to_feature_vector(image_file)
            label = category_to_label[category]
            data.append((features.tolist(), float(label)))

    schema = ["features", "label"]
    df = spark.createDataFrame(data, schema=schema)

    array_to_vector_udf = udf(lambda l: Vectors.dense(l), VectorUDT())
    df = df.withColumn("features", array_to_vector_udf(df["features"]))
    return df.withColumn("label", df["label"].cast(DoubleType()))


def train_model(train_data, model_path):
    lr = LogisticRegression(featuresCol="features", labelCol="label", maxIter=10, family="multinomial")
    pipeline = Pipeline(stages=[lr])

    model = pipeline.fit(train_data)

    predictions = model.transform(train_data)
    evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
    accuracy = evaluator.evaluate(predictions)
    print(f"Precisión del modelo: {accuracy}")

    model.save(model_path)
    return model


if __name__ == '__main__':
    total_start_time = time.time()

    spark = SparkSession.builder \
        .appName("Clasificacion Imagenes Playas") \
        .config("spark.driver.memory", "4g") \
        .config("spark.executor.memory", "4g") \
        .config("spark.executor.memoryOverhead", "512m") \
        .config("spark.driver.memoryOverhead", "512m") \
        .getOrCreate()

    sc = spark.sparkContext
    sc.setLogLevel("ERROR")

    if os.path.exists(MODEL_PATH):
        print(f"Eliminando modelo anterior")
        shutil.rmtree(MODEL_PATH)

    prepare_start_time = time.time()
    train_data = prepare_data(spark, TRAIN_PATH)
    prepare_end_time = time.time()

    train_start_time = time.time()
    model = train_model(train_data, MODEL_PATH)
    train_end_time = time.time()

    spark.stop()

    total_end_time = time.time()

    print(f"Tiempo de preparación de datos: {prepare_end_time - prepare_start_time} segundos")
    print(f"Tiempo de entrenamiento del modelo: {train_end_time - train_start_time} segundos")
    print(f"Tiempo total de ejecución: {total_end_time - total_start_time} segundos")
