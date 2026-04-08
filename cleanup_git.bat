taskkill /F /IM "git*" /T
taskkill /F /IM "vim*" /T
del /q /f .git\index.lock
del /q /f .git\.COMMIT_EDITMSG.swp
git add .
git commit -m "Refine mobile swiping mechanics"
git push origin main
