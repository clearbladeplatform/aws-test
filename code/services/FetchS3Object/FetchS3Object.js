// Can pass in parameter with filename
PARAMETERIZED = false
COLLECTION = "aws_s3_resources"
/**
 * Fetch the contents of an access-controlled AWS S3 Resource
 * 
 * @param {string} filename - filename associated with a row in aws_s3_resources collection
 * @returns {string} content - contents of AWS S3 hosted file
 */
function FetchS3Object(req, resp){
    // This is associated with a configured row in `aws_s3_resources` collection
    filename = "s3.txt"
    if(PARAMETERIZED){
        filename = req.params.filename
    }
    ClearBlade.init({request:req})
    ClearBlade.Query({collectionName:COLLECTION}).equalTo("filename", filename).fetch(getFile)
    
    function getFile(err, data){
        if(err ||  ! data || data.TOTAL !== 1){
            resp.error("Failed to find filename: " + filename + " due to error: " + JSON.stringify(data))
        }
        var url = data.DATA[0].url
        var http = Requests()
        http.get({url}, complete)
    }
    
    
    function complete(err, data){
        if(err ){
            resp.error("Failed to GET S3 URL: " + JSON.stringify(err))
        }
        resp.success(data)
    }
}