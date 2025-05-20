
        // check extension of file to be upload
function checkFileExtension(file) {
            var flag = true;
            var extension = file.substr((file.lastIndexOf('.') + 1));
            switch (extension) {
                //case 'pdf':
                //case 'PDF':
                case 'doc': 
                case 'DOC':
                case 'docx':
                case 'DOCX':
                    flag = true;
                    break;
                default:
                    flag = false;
            }
            return flag;
        }

        //get file path from client system
        function getNameFromPath(strFilepath) {
            var objRE = new RegExp(/([^\/\\]+)$/);
            var strName = objRE.exec(strFilepath);

            if (strName == null) {
                return null;
            }
            else {
                return strName[0];
            }
        }

        function UpdatFileInVersion(VersionID, fileName, ViewFile, reqFilename)
        {
            var vUrl = window.location.host; 
            vUrl = "http://" + vUrl + "/";
            vUrl = "../FullpaperSubmission.aspx/ShowUploadedFiles";
            VersionID = 0;
            $.ajax({
                type: "POST",
                url: vUrl,
                data: '{"VersionID": ' + VersionID + ', "FileName": "' + fileName + '" }',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: "true",
                cache: "false",
                success: function (msg) {
                    $("#" + ViewFile).empty();

                    $("#" + ViewFile).append(msg.d);
                    $("#" + reqFilename).attr("disabled", true);
                    if (typeof Page_Validators != 'undefined') {
                        for (i = 0; i <= Page_Validators.length; i++) {
                            var vldGrp = null;
                            if (Page_Validators[i] != null) {
                                if (Page_Validators[i].id == reqFilename) {
                                    ValidatorEnable(Page_Validators[i], false);
                                };
                            }
                        }
                    };
                    $("#" + reqFilename).css("display", "none");
                    
                },
                Error: function (x, e) {
                    alert("Please try again");
                }
            });
        }

        // Asynchronous file upload process
        function ajaxFileUploadFullpaperSubmission(versionID, fuID, ViewFile, reqFilename)
        { 
            var vfuID = document.getElementById(fuID).value; 
            var FileFolder = "";//$('#ctl00_ContentPlaceHolder2_hdnFileFolder').val();
            var fileToUpload = getNameFromPath(vfuID);
            //alert("fun: " + fileToUpload);
           
            var filename = fileToUpload.substr(0, (fileToUpload.lastIndexOf('.')));
            if (checkFileExtension(fileToUpload)) {
              
                var flag = true;
              //  var counter = $('#ContentPlaceHolder1_hdnCountFiles').val();
                
                if (filename != "" && filename != null && FileFolder != "0") {
                    //Check duplicate file entry
                    //for (var i = 1; i <= counter; i++) {
                    //    var hdnDocId = "#hdnDocId_" + i;

                    //    if ($(hdnDocId).length > 0) {
                    //        var mFileName = "#lblfilename_" + i;
                    //        if ($(mFileName).html() == filename) {
                    //            flag = false;
                    //            break;
                    //        }
                    //    }
                    //}
                    if (flag == true) {
                        $("#loading").ajaxStart(function() {
                            $(this).show();
                        }).ajaxComplete(function() {
                            $(this).hide();
                            return false;
                        });

                        $.ajaxFileUpload({
                            url: 'FileUploadFullpaperSubmission.ashx?id=' + FileFolder,
                            secureuri: false,
                            fileElementId: fuID,
                            dataType: 'json',
                            success: function (data, status) { 
                                UpdatFileInVersion(versionID, filename, ViewFile, reqFilename);
                            },
                            error: function (data, status, e) {
                               // console.log(data + 'dsds'); console.log(status + 'ds');
                                alert(e);
                            }
                        });
                    }
                    //else {
                    //    alert('file ' + filename + ' already exist')
                    //    return false;
                    //}
                }
            }
            else {
                alert('Only doc, docx file is allowed.');  // alert allowed files //doc, docx
            }
            return false;

        } 
        // delete existing file
        function deleterow(divrow) {
            var str = divrow.split(",");
            var row = str[0];
            var file = str[1];
            var path = $('#ctl00_ContentPlaceHolder2_hdnUploadFilePath').val();
            if (confirm('Are you sure to delete?')) {
                $.ajax({
                    url: "FileUpload.ashx?path=" + path + "&file=" + file,
                    type: "GET",
                    cache: false,
                    async: true,
                    success: function(html) {

                    }
                });
                $(row).remove();
            }
            return false;
        }