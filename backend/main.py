import os
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image
import io
import base64

# Force TensorFlow to use CPU only (Disable GPU)
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"  # Forces TensorFlow to use CPU only

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model from folder containing 'saved_model.pb' and 'variables/'
vae = tf.saved_model.load('./vae_model')  # Replace with your model folder path

@app.get("/")
def read_root():
    return {"message": "VAE FastAPI is running locally."}

def preprocess(image_bytes, size=(128, 128)):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize(size)
        image_array = np.array(image).astype(np.float32) / 255.0
        image_tensor = np.expand_dims(image_array, axis=0)
        print(f"[INFO] Preprocessed image shape: {image_tensor.shape}")
        return image_tensor
    except Exception as e:
        print(f"[ERROR] Preprocessing failed: {e}")
        raise

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        input_tensor = preprocess(image_bytes)

        print("[INFO] Sending to VAE model...")
        output_raw = vae(input_tensor)  # Run the model on input
        print(f"[DEBUG] Model output: {output_raw}")  # Debug print

        # Assuming the model outputs an image directly, use it appropriately
        output_tensor = output_raw["output_0"]  # Make sure this matches the model's output structure
        print(f"[INFO] Output tensor shape: {output_tensor.shape}")

        output_image = np.clip(output_tensor[0].numpy() * 255, 0, 255).astype(np.uint8)
        image_pil = Image.fromarray(output_image)

        buffer = io.BytesIO()
        image_pil.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode()

        return JSONResponse(content={"image_base64": img_str})

    except Exception as e:
        print(f"[ERROR] Exception: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Render provides $PORT
    uvicorn.run("main:app", host="0.0.0.0", port=port)
