import os
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image
import io
import base64

# Force TensorFlow to use CPU
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

app = FastAPI()

# Allow all CORS (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load the SavedModel correctly
vae = tf.saved_model.load('./vae_model')
vae_predict_fn = vae.signatures["serving_default"]  # <-- This is your inference function

@app.get("/")
def read_root():
    return {"message": "VAE FastAPI is running locally."}

def preprocess(image_bytes, size=(128, 128)):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize(size)
        image_array = np.array(image).astype(np.float32) / 255.0
        image_tensor = np.expand_dims(image_array, axis=0)  # shape: (1, 128, 128, 3)
        return image_tensor
    except Exception as e:
        raise RuntimeError(f"Preprocessing failed: {e}")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        input_tensor = preprocess(image_bytes)

        # ✅ Convert numpy array to tf.Tensor and run prediction
        input_tensor_tf = tf.convert_to_tensor(input_tensor)

        print("[INFO] Running model...")
        outputs = vae_predict_fn(input_tensor_tf)

        # 🔍 Print keys to know what output to extract
        print(f"[DEBUG] Output keys: {outputs.keys()}")

        # ✅ Extract actual output using the correct key
        # Replace 'output_0' with the actual key from the print
        output_tensor = list(outputs.values())[0]

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
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
