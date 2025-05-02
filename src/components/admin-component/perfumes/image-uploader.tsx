"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export function ImageUploader({
  images,
  setImages,
}: {
  images: (File | { preview: string })[];
  setImages: React.Dispatch<
    React.SetStateAction<(File | { preview: string })[]>
  >;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label>Images</Label>

      {/* Custom file input */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          Choose Files
        </Button>

        <span className="text-sm text-muted-foreground">
          {images.length > 0
            ? `${images.length} file${images.length > 1 ? "s" : ""} selected`
            : "No file selected"}
        </span>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (!e.target.files) return;
            const files = Array.from(e.target.files);
            setImages((prev) => [...prev, ...files]);
            e.target.value = ""; 
          }}
          className="hidden"
        />
      </div>

      {/* Preview */}
      <div className="flex flex-wrap gap-2">
        {images.map((file, i) => (
          <div key={i} className="relative w-40 h-52">
            <Image
              src={
                file instanceof File ? URL.createObjectURL(file) : file.preview
              }
              alt="preview"
              className="object-cover w-full h-full rounded"
              fill
            />
            <span className="absolute bottom-0 left-0 bg-black/40 text-white w-full text-center text-sm">
              Display order {i}
            </span>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-1 right-1"
              onClick={() =>
                setImages((prev) => prev.filter((_, idx) => idx !== i))
              }
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
