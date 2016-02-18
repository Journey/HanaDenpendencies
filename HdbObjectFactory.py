import HdbObjects;
import files;
import HdbView,HdbAttributeView,HdbCaculationView,HdbProcedure,HdbBaseObject;

def getInstance(file):
    objectType = files.get_file_type(file);
    if HdbObjects.isHdbView(objectType):
        instance = HdbView.Type(file);
    elif HdbObjects.isAttributeview(objectType):
        instance = HdbAttributeView.Type(file);
    elif HdbObjects.isCaculationview(objectType):
        instance = HdbCaculationView.Type(file);
    elif HdbObjects.isHdbProcedure(objectType):
        instance = HdbProcedure.Type(file);
    else:
        instance = HdbBaseObject.Type(file);
        #print("unnkonw handled type:"+objectType);

    return instance;
    
