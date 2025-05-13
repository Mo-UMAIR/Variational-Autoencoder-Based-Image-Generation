# main.py

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from keras.layers import TFSMLayer
import numpy as np
from PIL import Image
import io
import base64

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
vae = TFSMLayer("vae_model", call_endpoint="serving_default")

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
        output_raw = vae(input_tensor)
        print(f"[DEBUG] Model output keys: {output_raw.keys()}")  # Debug print

        output_tensor = output_raw["output_0"]  # Use the correct key here
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


#   uvicorn main:app --reload
