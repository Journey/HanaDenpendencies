import os;
import re;
_filterPattern = r'(\\tests)|(\\ui)|(\\service)|(\\trp\\rail)';
_ignorDirPatterns=r"^(tests)|(ui)|(service)$";
def isSkip(path):
    if re.search(_filterPattern, path):
        return True;
    else:
        return False;
def ignorDirectory(sDirName):
    if re.search(_ignorDirPatterns, sDirName):
        return True;
    else:
        return False;

def get_file_paths(dirPath,fileNames):
    files = []
    for name in fileNames:
        files.append(os.path.join(dirPath, name))
    return files

def extract_files(sDir):
    files = []
    for(dirPath,dirNames,fileNames) in os.walk(sDir):
        if isSkip(dirPath):
            continue;
        else:
            files.extend(get_file_paths(dirPath, fileNames))
    return files

def get_file_type(fileName):
    return os.path.splitext(fileName)[1]

def category_files(files):
    fileTypes = {}
    for file in files:
        category = get_file_type(file)
        if category in fileTypes:
            fileTypes[category].append(file)
        else:
            fileTypes[category]=[file]

    print(fileTypes.keys())
    return fileTypes


if __name__ == '__main__':
    directory = r'C:\Project\rail\hana_trp\hana_trp\hana_trp\trp-backend\sap\tm\trp'
    files = extract_files(directory)
    category_files(files)
