"""Builds the app's raster icons from the artwork in assets/images/icon-art.jpg
(an original anime-style bodybuilder made with Google Gemini, 1024 x 1024 on
black).

    python scripts/build-icons.py

Writes to assets/images/:
  icon.png             1024  full-bleed icon (older Android, Expo tooling)
  adaptive-icon.png    1024  Android adaptive foreground: the art fills the
                             72 dp viewport of the 108 dp layer, so round and
                             squircle masks keep the head and both fists
  splash-icon.png      1024  splash image: the art inside a soft circle so its
                             cropped arms and torso never show a hard edge
  adaptive-icon-monochrome.png
                       1024  Android 13+ themed icon: the figure's silhouette
                             (white on transparent; Android tints it), cut
                             from the art by removing the backdrop and the
                             lime circle behind him
  favicon.png            48  web preview
  play-store-icon.png   512  Google Play listing (Play rounds the corners)

Needs Pillow (pip install pillow).
"""

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

# Sample points inside the lime circle around the figure (left/right of the
# torso, beside the head); only those that really are lime are used as seeds.
CIRCLE_SEEDS = [(250, 700), (780, 700), (330, 330), (700, 330), (400, 200), (640, 200)]
MARK = (255, 0, 255)

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "assets" / "images"
GROUND = (10, 10, 10)  # theme/tokens.ts ground #0A0A0A
SIZE = 1024


def flatten_background(art: Image.Image) -> Image.Image:
    """Recolours the art's pure-black backdrop to the app's ground (#0A0A0A),
    flood-filling from the four corners so the black linework inside the
    figure stays untouched."""
    out = art.copy()
    for corner in [(0, 0), (SIZE - 1, 0), (0, SIZE - 1), (SIZE - 1, SIZE - 1)]:
        ImageDraw.floodfill(out, corner, GROUND, thresh=24)
    return out


def silhouette(art: Image.Image) -> Image.Image:
    """Alpha mask of the figure: everything except the backdrop and the lime
    circle, each flood-filled so the figure's own lime bands stay in."""
    work = art.copy()
    for corner in [(0, 0), (SIZE - 1, 0), (0, SIZE - 1), (SIZE - 1, SIZE - 1)]:
        ImageDraw.floodfill(work, corner, MARK, thresh=40)
    px = art.load()
    for x, y in CIRCLE_SEEDS:
        r, g, b = px[x, y]
        if g > 180 and b < 140 and g > r:
            ImageDraw.floodfill(work, (x, y), MARK, thresh=70)
    # 0 where the fill marked a pixel, 255 everywhere else (the figure).
    marked = ImageChops.difference(work, Image.new("RGB", (SIZE, SIZE), MARK)).convert("L")
    mask = marked.point(lambda v: 255 if v else 0)
    # Close hairline gaps, then drop specks.
    mask = mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    return mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))


def scaled(art: Image.Image, size: int) -> Image.Image:
    return art.resize((size, size), Image.LANCZOS)


def on_ground(size: int) -> Image.Image:
    return Image.new("RGB", (size, size), GROUND)


def main() -> None:
    source = Image.open(IMAGES / "icon-art.jpg").convert("RGB").resize((SIZE, SIZE), Image.LANCZOS)
    art = flatten_background(source)

    # Full-bleed icon and its smaller copies.
    art.save(IMAGES / "icon.png", optimize=True)
    scaled(art, 512).save(IMAGES / "play-store-icon.png", optimize=True)
    scaled(art, 48).save(IMAGES / "favicon.png", optimize=True)

    # Adaptive foreground: the visible viewport is the centre 72/108 of the
    # layer. The art is drawn a touch larger than that viewport (it shows the
    # middle 97% of the art) so the figure reads big on the home screen while
    # the hair bun stays inside a round mask; the parallax margin around it is
    # the same ground colour.
    viewport = round(SIZE * 72 / 108)
    art_px = round(viewport / 0.97)
    at = ((SIZE - art_px) // 2, (SIZE - art_px) // 2)
    fg = on_ground(SIZE)
    fg.paste(scaled(art, art_px), at)
    fg.save(IMAGES / "adaptive-icon.png", optimize=True)

    # Themed icon: the silhouette, placed exactly like the colour foreground.
    mono = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    white = Image.new("RGBA", (art_px, art_px), (255, 255, 255, 255))
    mono.paste(white, at, silhouette(source).resize((art_px, art_px), Image.LANCZOS))
    mono.save(IMAGES / "adaptive-icon-monochrome.png", optimize=True)

    # Splash: Android 12+ shows the splash icon inside a circle two thirds of
    # its canvas, so the art sits inside that circle with a feathered edge.
    circle = round(SIZE * 2 / 3)
    mask = Image.new("L", (circle, circle), 0)
    ImageDraw.Draw(mask).ellipse((6, 6, circle - 6, circle - 6), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(5))
    splash = on_ground(SIZE)
    splash.paste(scaled(art, circle), ((SIZE - circle) // 2, (SIZE - circle) // 2), mask)
    splash.save(IMAGES / "splash-icon.png", optimize=True)

    for name in ["icon.png", "adaptive-icon.png", "adaptive-icon-monochrome.png", "splash-icon.png", "favicon.png", "play-store-icon.png"]:
        print("wrote", name)


if __name__ == "__main__":
    main()
