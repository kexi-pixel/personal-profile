from __future__ import annotations

from pathlib import Path
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parent.parent
ARCHIVE = ROOT / "personal-profile-source.zip"
TARGET_PREFIXES = ("src/", "public/")


def main() -> None:
    if not ARCHIVE.exists():
        raise SystemExit(f"Missing archive: {ARCHIVE}")

    with ZipFile(ARCHIVE) as archive:
        members = [
            name
            for name in archive.namelist()
            if any(name.startswith(prefix) for prefix in TARGET_PREFIXES)
        ]
        archive.extractall(ROOT, members=members)


if __name__ == "__main__":
    main()
