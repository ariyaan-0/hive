from imagekitio import ImageKit
from ..config import settings

# Initialize ImageKit
imagekit = ImageKit(
    private_key=settings.imagekit_private_key,
    public_key=settings.imagekit_public_key,
    url_endpoint=settings.imagekit_url
)

def upload_image(file, file_name: str, folder: str = "/"):
    """
    Uploads a file to ImageKit and returns the URL.
    Best practice: Centralize storage logic and handle errors here.
    """
    try:
        upload = imagekit.upload_file(
            file=file,
            file_name=file_name,
            options={
                "folder": folder,
                "use_unique_file_name": True,
            }
        )
        return upload.url
    except Exception as e:
        print(f"Error uploading to ImageKit: {e}")
        return None
