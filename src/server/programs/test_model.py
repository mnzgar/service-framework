import os
import sys
import time

import numpy as np
from PIL import Image, ImageFilter
from tensorflow.keras.preprocessing.image import img_to_array
from pyspark.ml import PipelineModel
from pyspark.ml.linalg import Vectors, VectorUDT
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf

DATA_PATH = "public/model_data"
TRAIN_PATH = f"{DATA_PATH}/train"
TEST_PATH = f"{DATA_PATH}/test"
MODEL_PATH = "public/beach_model"


def load_model(model_path):
    if os.path.exists(model_path):
        print(f"Cargando modelo desde {model_path}")
        return PipelineModel.load(model_path)

    print(f"Modelo no encontrado en {model_path}")
    return None


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


def predict_image(spark, model, test_image_path, train_path):
    features = image_to_feature_vector(test_image_path)
    df = spark.createDataFrame([(features.tolist(),)], ["features"])

    array_to_vector_udf = udf(lambda l: Vectors.dense(l), VectorUDT())
    df = df.withColumn("features", array_to_vector_udf(df["features"]))

    prediction = model.transform(df).select("prediction").collect()[0]["prediction"]
    categories = os.listdir(train_path)
    category_to_label = {category: idx for idx, category in enumerate(categories)}
    label_to_category = {v: k for k, v in category_to_label.items()}
    print(f"La playa es: {label_to_category[prediction]}")


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

    model_load_start_time = time.time()
    model = load_model(MODEL_PATH)
    model_load_end_time = time.time()

    predict_time = 0
    if model is not None:
        if len(sys.argv) > 1:
            test_image_path =  f"{TEST_PATH}/{sys.argv[1]}"

            predict_start_time = time.time()
            predict_image(spark, model, test_image_path, TRAIN_PATH)
            predict_end_time = time.time()
            predict_time = predict_end_time - predict_start_time
        else:
            print("No se proporcionó una imagen de prueba")
    else:
        print(f"Modelo no encontrado en {MODEL_PATH}, entrene uno primero")

    spark.stop()

    total_end_time = time.time()

    print(f"Tiempo de carga del modelo: {model_load_end_time - model_load_start_time} segundos")
    print(f"Tiempo de predicción: {predict_time} segundos")
    print(f"Tiempo total de ejecución: {total_end_time - total_start_time} segundos")
