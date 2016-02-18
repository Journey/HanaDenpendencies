import files,HdbObjects,HdbObjectFactory;
import json;
def main(sRootPath):
    allObjects = {};
    # get all files
    file_list = files.extract_files(sRootPath);
    #print(file_list);
    print("extract files done");
    # get known files
    known_files = getKnownfiles(file_list);
    #print(known_files);
    print("filt files done");
    # init class based on file
    for file in known_files:
        obj = HdbObjectFactory.getInstance(file);
        if obj.name in allObjects:
            print("duplicate item::"+obj.name);
        else:
            allObjects[obj.name] = obj;
    #init where used
    dependency_not_exists = [];
    for objKey in allObjects:
        hdbObject = allObjects[objKey];
        for dependency in hdbObject.dependencies:
            if dependency not in allObjects:# the dependency does not exists
                hdbObject.addNoneExistDependencies(dependency);
            else:
                if dependency != hdbObject.name:
                    allObjects[dependency].addWhereUsed(hdbObject.name);

    #convert to json object
    jsonObj = {};
    for objKey in allObjects:
        hdbObject = allObjects[objKey];
        jsonObj[hdbObject.name] = hdbObject.toJson();

    #writ to json files
    with open(r"ui\data\relations.json","w",encoding="UTF-8") as file:
        file.write(json.dumps(jsonObj, sort_keys="True"));
        
    #print where used
    #for objKey in allObjects:
    #    if len(allObjects[objKey].noneExsitDependencies) > 0:
    #        print("==================="+objKey);
    #        print(allObjects[objKey].noneExsitDependencies);

def getKnownfiles(file_list):
    known_files = [];
    for file in file_list:
        if HdbObjects.isKnownType(files.get_file_type(file)):
            known_files.append(file);
    return known_files;
        

if __name__ == "__main__":
    dir =  r'C:\Project\rail\hana_trp\hana_trp\hana_trp\trp-backend\sap\tm\trp';
    main(dir);
    print("finished")
    
