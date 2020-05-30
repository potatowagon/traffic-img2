from zipfile import ZipFile
import os

# Zip the files from given directory that matches the filter
def addDirToZipObj(dirName, zipObj):
       for folderName, subfolders, filenames in os.walk(dirName):
           for filename in filenames:
                filePath = os.path.join(folderName, filename)
                zipObj.write(filePath, filePath)

def main():
    with ZipFile('deploy.zip', 'w') as zipObj:
        zipObj.write('package-lock.json')
        zipObj.write('package.json')
        addDirToZipObj('client', zipObj)
        addDirToZipObj('html_templates', zipObj)
        addDirToZipObj('secrets', zipObj)
        addDirToZipObj('server', zipObj)

main()