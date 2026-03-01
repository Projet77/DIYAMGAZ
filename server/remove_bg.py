from PIL import Image

def remove_white_background(input_path, output_path, tolerance=235):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if the pixel is near-white (R, G, B > tolerance)
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            # Change near-white pixels to transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    input_file = "../client/public/images/Logo.jpeg"
    output_file = "../client/public/images/Logo.png"
    
    print(f"Processing {input_file} -> {output_file}")
    remove_white_background(input_file, output_file)
    print("Done!")
