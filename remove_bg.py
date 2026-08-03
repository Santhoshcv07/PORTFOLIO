from rembg import remove
from PIL import Image

input_path = 'public/assets/images/portrait.png'
output_path = 'public/assets/images/portrait_nobg.png'

with open(input_path, 'rb') as i:
    with open(output_path, 'wb') as o:
        input_data = i.read()
        output_data = remove(input_data)
        o.write(output_data)
