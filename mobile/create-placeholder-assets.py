from pathlib import Path
import base64

png_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAF" \
           "c1VAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJ0UkGAAAA" \
           "AAB4E8P5PAAAAAElFTkSuQmCC"

base_dir = Path(__file__).resolve().parent
assets_dir = base_dir / "assets"
assets_dir.mkdir(exist_ok=True)

for name in ["icon.png", "adaptive-icon.png"]:
    (assets_dir / name).write_bytes(base64.b64decode(png_data))

print("Created placeholder PNG assets in", assets_dir)
