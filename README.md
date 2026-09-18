# Roboter-Python

Kleine Browser-Umgebung, um rudimentäres Python mit einem Roboter auf einem Gitter zu üben. Kein Build, kein Server zwingend.

## Lokal

`index.html` im Browser öffnen oder:

```bash
python3 -m http.server 8099
```

Dann [http://127.0.0.1:8099/](http://127.0.0.1:8099/) aufrufen.

## GitHub Pages

Die Seite ist statisch. Nach dem ersten Push:

1. Im GitHub-Repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch `main`, Ordner `/` (root)

Eigene Programme liegen im `localStorage` des jeweiligen Ursprungs (`localhost` und die Pages-URL sind getrennt).
