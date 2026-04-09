from imagekitio import ImageKit
from ..core.config import settings

# Initialize ImageKit
imagekit = ImageKit(
    private_key=settings.imagekit_private_key,
    base_url=settings.imagekit_url
)

def upload_image(file, file_name: str, folder: str = "/"):

    # Uploads a file to ImageKit and returns the URL.
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
