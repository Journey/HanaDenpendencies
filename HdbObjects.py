TYPE_HDBDD = ".hdbdd";
TYPE_CALCULATIONVIEW = ".calculationview";
TYPE_HDBDD = ".hprvocabulary";
TYPE_HDBRULDEC = ".hdbruldec";
TYPE_CSV = ".csv";
TYPE_XSJSLIB = ".xsjslib";
TYPE_HPRRULE = ".hprrule";
TYPE_HDBSTRUCTURE = ".hdbstructure";
TYPE_HDBTABLE = ".hdbtable";
TYPE_HDBTI = ".hdbti";
TYPE_ATTRIBUTEVIEW = ".attributeview";
TYPE_HDBPROCEDURE = ".hdbprocedure";
TYPE_HDBFLOWGRAPH = ".hdbflowgraph";
TYPE_HDBVIEW = ".hdbview";
TYPE_HDBSEQURECE = ".hdbsequence";
TYPE_XSJS=".xsjs";
TYPE_JS=".js";
TYPE_XML=".xml"

_knownTypes = (
    TYPE_HDBTABLE,
    TYPE_CALCULATIONVIEW,
    TYPE_HDBPROCEDURE,
    TYPE_ATTRIBUTEVIEW,
    TYPE_HDBVIEW,
    TYPE_HDBSEQURECE,
    TYPE_HDBSTRUCTURE
);
def isHdbdd(type):
    return type == TYPE_HDBDD;

def isCaculationview(type):
    return type == TYPE_CALCULATIONVIEW;

def isHdbTable(type):
    return type == TYPE_HDBTABLE;

def isAttributeview(type):
    return type == TYPE_ATTRIBUTEVIEW;

def isHdbProcedure(type):
    return type == TYPE_HDBPROCEDURE;

def isHdbView(type):
    return type == TYPE_HDBVIEW;

def isKnownType(type):
    try:
        _knownTypes.index(type);
        return True;
    except ValueError:
        return False;



