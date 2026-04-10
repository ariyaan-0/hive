import requests
import base64
from imagekitio import ImageKit
from ..core.config import settings

# Initialize ImageKit
imagekit = ImageKit(
    private_key=settings.imagekit_private_key
)

def upload_image(file, file_name: str, folder: str = "/"):
    """
    Uploads a file to ImageKit and returns the URL.
    """
    try:

        upload = imagekit.files.upload(
            file=file,
            file_name=file_name,
            folder=folder,
            use_unique_file_name=True
        )

        return upload.url
    except Exception as e:
        print(f"Error uploading to ImageKit: {e}")
        return None

def delete_image_by_url(image_url: str):
    """
    Finds and drops a physical asset from the ImageKit CDN utilizing its URL natively.
    """
    if not image_url or "imagekit.io" not in image_url:
        return False
        
    try:
        api_url = f"https://api.imagekit.io/v1/files?searchQuery=url:\"{image_url}\""
        auth_string = f"{settings.imagekit_private_key}:"
        base64_string = base64.b64encode(auth_string.encode('ascii')).decode('ascii')
        
        headers = {"Authorization": f"Basic {base64_string}"}
        
        res = requests.get(api_url, headers=headers)
        if res.status_code == 200:
            data = res.json()
            if data and len(data) > 0:
                file_id = data[0].get('fileId')
                if file_id:
                     delete_url = f"https://api.imagekit.io/v1/files/{file_id}"
                     del_res = requests.delete(delete_url, headers=headers)
                     if del_res.status_code == 204:
                         print(f"Purged stranded media blob {file_id} from ImageKit globally.")
                         return True
    except Exception as e:
        print(f"Failed to purge image {image_url}: {e}")
    return False
