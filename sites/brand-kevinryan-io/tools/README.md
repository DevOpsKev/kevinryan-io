# Brand asset generators

The asset library and `public/index.html` are generated, not hand-edited.
Regenerate after any change to the Tokyo Night Moon block in `dotfiles/.chezmoidata.yaml`.

    pip install fonttools brotli cairosvg pillow
    npm i @fontsource/space-grotesk @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono

    python3 mkwordmark.py   # Space Grotesk 700 glyphs -> outlined KR&A paths
    python3 mksvg.py        # wordmark SVG masters, one per accent
    python3 mkmark.py       # diagonal-split mark SVG masters
    python3 raster.py       # PNG rasters, favicons, social avatars
    python3 build.py        # public/index.html
    node mkpdf.js           # public/kra-brand-guidelines.pdf

`contrast.py` prints the measured WCAG ratios that the document quotes.
Run it before changing any colour value.
