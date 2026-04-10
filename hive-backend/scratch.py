import sys
import logging
from app.utils.media import imagekit

print("Files Dir:", dir(imagekit))
print("Files Subdir:", dir(imagekit.files) if hasattr(imagekit, 'files') else "No files")
