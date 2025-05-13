import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegenerationSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [regeneratedImage, setRegeneratedImage] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setRegeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setRegeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegenerateClick = async () => {
    if (!selectedImage) return;

    setIsRegenerating(true);
    setActiveTab("result");

    // Create FormData to send the image to backend
    const formData = new FormData();
    const blob = await fetch(selectedImage)
      .then(res => res.blob())
      .catch((err) => {
        console.error("Error fetching the image: ", err);
      });

    formData.append("file", blob as Blob, "image.jpg");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setRegeneratedImage(`data:image/png;base64,${data.image_base64}`);
      } else {
        console.error("Error regenerating image:", data.error);
      }
    } catch (error) {
      console.error("Error during image regeneration:", error);
    }

    setIsRegenerating(false);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setRegeneratedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section id="regenerate" className="py-16 bg-green-50 w-full flex justify-center items-center">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Regenerate Your Images</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload an image and see it transformed using our advanced regeneration technology
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Image Regeneration Tool</CardTitle>
              <CardDescription>Upload an image to regenerate it using our VAE model</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="result" disabled={!selectedImage}>
                    Result
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="mt-4">
                  {!selectedImage ? (
                    <div
                      className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">Upload your image</h3>
                      <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to browse</p>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Select Image
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="aspect-video relative rounded-lg overflow-hidden">
                        <Image
                          src={selectedImage || "/placeholder.svg"}
                          alt="Selected image"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Button
                        
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="result" className="mt-4">
                  {regeneratedImage ? (
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <Image
                        src={regeneratedImage || "/placeholder.svg"}
                        alt="Regenerated image"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">
                        {isRegenerating ? "Regenerating image..." : "Regenerated image will appear here"}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("upload")}>
                Back to Upload
              </Button>
              <Button onClick={handleRegenerateClick} disabled={!selectedImage || isRegenerating}>
                {isRegenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "Regenerate Image"
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <strong>Upload an image</strong> - Select or drag and drop any image you want to regenerate
                  </li>
                  <li>
                    <strong>Processing</strong> - Our VAE model analyzes your image and encodes it into a latent
                    representation
                  </li>
                  <li>
                    <strong>Regeneration</strong> - The decoder part of the VAE reconstructs the image with transformed
                    features
                  </li>
                  <li>
                    <strong>Result</strong> - View and download your regenerated image
                  </li>
                </ol>
                <p className="mt-4 text-sm text-muted-foreground">
                  Note: This is a demonstration. In a production environment, the regeneration would be performed by an
                  actual trained VAE model running on a server.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
