import os;
import re;

class Type:
    objectPattern = r"sap.tm.trp.[a-zA-Z1-9._-]*::[a-zA-Z1-9_-]*";
    servicePattern = r"sap.tm.trp.service*";
    #file - is the fullfile path
    def __init__(self,file):
        self.fullPath = file; #full file path as id
        (filePath, fileName) = os.path.split(file);
        (shortName, extension) = os.path.split(fileName);
        self._inComments = False;
        self.type = self.extractType(extension);
        self.name = self.extractName(file);
        self.id = "".join([self.name,self.type]);
        self.content = "";
        self.whereUsed = [];
        self.noneExsitDependencies = [];
        self.priviliages = [];
        self.dependencies = self.getDependencies();
        self.postProcess();
    @staticmethod
    def extractType(file):
        result = re.search(r"\.[a-zA-Z]{1,30}$", file);
        return result.group();
        
    @staticmethod
    def extractName(file):
        match = re.search(r"sap\\tm\\.*",file)
        fileName = match.group(0);
        dirs = fileName.split("\\");
        name = dirs.pop();
        prefix = ".".join(dirs);
        #aabce.cacluview =>aabce
        name = re.sub(r"\.[a-zA-Z]{1,30}$","",name);
        hanaObjectName ="::".join( [prefix,name])
        return hanaObjectName

    def isComment(self,line):
        line = line.strip();
        if self.isBlockComment(line):
            return True;
        elif self.isSingleComment(line):
            return True;
        else:
            return False;
        
    @staticmethod
    def isSingleComment(line):
        pattern = r"^--";
        if re.search(pattern,line):
            return True;
        return False
    
    def isBlockComment(self,line):
        if self._isStartBlockComment(line):
            return True;
        elif self._isEndBlockComment(line):
            self._inComments = False;
            return True;
        elif self._inComments:
            return True;
        else:
            return False;
        
    def _isStartBlockComment(self,line):
        pattern = r"^/\*";
        if re.search(pattern,line):
            self._inComments = True;
            self._isEndBlockComment(line);
            #print(line.encode("utf-8"));
            return True;
        return False;

    def _isEndBlockComment(self,line):
        pattern = r"\*/";
        if(re.search(pattern,line)):
            """
            if not re.search(r"\*/$",line):
                print(line.encode("utf-8"));
            """
            self._inComments = False;
            return True;
        return False;

    def addWhereUsed(self,fileId):
        self.whereUsed.append(fileId)

    def getWhereUsedCount(self):
        return len(self.whereUsed);

    def addDependency(fileId):
        self.dependencies.append(fileId);

    def addNoneExistDependencies(self,fileId):
        self.noneExsitDependencies.append(fileId);

    def toJson(self):
        return {
            "name": self.name,
            "type": self.type,
            "whereUsedList": self.whereUsed,
            "dependencies": self.dependencies,
            "nonExistsDependencies": self.noneExsitDependencies
        };

    def getDependencies(self):
        dependencies = []
        with open(self.fullPath,'r') as f:
            for line in f:
                if not self.isComment(line):
                    dependencies.extend(re.findall(self.objectPattern, line))
        dependencies = self._uniqueList(dependencies);
        if self.name in dependencies:
            dependencies.remove(self.name);
        return dependencies;

    def postProcess(self):
        self.reportError();
        for dependency in self.dependencies:
            # process service priviliage
            if(re.search(self.servicePattern, dependency)):
                self.dependencies.remove(dependency);
                self.priviliages.append(dependency);
                #print(self.name);
                #print(dependency);
    # report error if the object has unclosed block comments
    def reportError(self):
        if self._inComments:
            raise Exception("unclosed block comments"+self.name);

    @staticmethod
    def _uniqueList(list):
        seen = set();
        return [x for x in list if x not in seen and not seen.add(x)];

                
if __name__ == '__main__':
    file = r'C:\Project\rail\hana_trp\hana_trp\hana_trp\trp-backend\sap\tm\trp\db\alert\alert.hdbtable';
    Typee(file);
