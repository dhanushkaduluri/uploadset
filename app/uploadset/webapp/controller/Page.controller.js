sap.ui.define([
    "sap/m/library",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Item",
    "sap/ui/model/json/JSONModel",
    "sap/m/upload/Uploader",
    "sap/m/MessageToast"
], function (MobileLibrary, Controller, Item, JSONModel, MessageToast) {
        // "use strict";
 
        return Controller.extend("sap.btp.uploadset.webapp.controller.Page", {
            onInit: function () {
 
            // Call the function to fetch data
            const url = "https://port4004-workspaces-ws-f7mzc.us10.trial.applicationstudio.cloud.sap/media/MediaFile";
            const that = this;
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data.value);
                    var oJSONModel = new JSONModel();
                    oJSONModel.setData(data.value);
                    // console.log(oJSONModel,"hii");
                    that.getView().setModel(oJSONModel, "mediafile")
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
 
 
           
            var oUploadSet = this.byId("UploadSet");
 
           
 
            // Modify "add file" button
            oUploadSet.getDefaultFileUploader().setButtonOnly(false);
            oUploadSet.getDefaultFileUploader().setTooltip("");
            oUploadSet.getDefaultFileUploader().setIconOnly(true);
            oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
            // oUploadSet.attachUploadCompleted(this.onUploadCompleted.bind(this));
        },
        onBeforeItemAdded: function (oEvent) {
            // const oUploadSet = oEvent.getSource();
            // const oParameters = oEvent.getParameters();
            // const oItem = oEvent.getParameter("item");
       
            // // console.log("File added: " + oItem);
       
            // const url = 'https://port4004-workspaces-ws-f7mzc.us10.trial.applicationstudio.cloud.sap/media/MediaFile';
       
            // const formData = new FormData();
            // formData.append('file', oItem.oFileObject); // Adjust key based on your API

            // const oUploadData = {
            //     mediaType: oItem.getMediaType(),
            //     fileName: oItem.getFileName(),
            //     size: oItem.getFileObject().size
            // };

            // const oDataModel = oUploadSet.getModel();
       
            // fetch(url, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json', // Change to your desired content type
            //     },
            //     body: JSON.stringify(oUploadData)
            // })
            
            // .then(response => {
            //     if (!response.ok) {
            //         throw new Error('Network response was not ok ' + response.statusText);
            //     }
            //     return response.json();
            // })
            // .then(data => {
            //     console.log('Success:', data); // Handle the response data
            // })
            // .catch(error => {
            //     console.error('There was a problem with the fetch operation:', error);
            // });
        },
        onAfterItemAdded: async function (oEvent) {
            const oUploadSet = this.byId("UploadSet");
            // const i18n = this.getModel("i18n").getResourceBundle();
            const oItem = oEvent.getParameter("item");
        
            // Access the model from the upload set or its parent
            const oDataModel = oUploadSet.getModel(); // Get the model directly from the UploadSet
            const oContext = this.getView().getBindingContext(); // Use this to get the binding context
        
            const sHeaderId = oContext ? oContext.getObject().id : null; // Safely access ID
        
            // if (!sHeaderId) {
            //     console.log("Header ID is not available.");
            //     return;
            // }
        
            const sServiceUrl = oDataModel.sServiceUrl;
        
            const oUploadData = {
                mediaType: oItem.getMediaType(),
                fileName: oItem.getFileName(),
                size: oItem.getFileObject().size
            };
        
            const oSettings = {
                url: `${sServiceUrl}/MediaFile`,
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                data: JSON.stringify(oUploadData)
            };
        
            try {
                const results = await $.ajax(oSettings);
                const id = results.id;
                const url = `${sServiceUrl}/MediaFile(id=${id})/content`;
                oItem.setUploadUrl(url);
                oUploadSet.setHttpRequestMethod("PUT")
                oUploadSet.uploadItem(oItem);
            } catch (error) {
                console.log("fileUploadErr", error.responseJSON?.error?.message || "Upload failed.");
            }
        }
,        
       
        onUploadSelectedButton: function () {
            var oUploadSet = this.byId("UploadSet");
 
            oUploadSet.getItems().forEach(function (oItem) {
                if (oItem.getListItem().getSelected()) {
                    oUploadSet.uploadItem(oItem);
                }
            });
        },
        onDownloadSelectedButton: function () {
            var oUploadSet = this.byId("UploadSet");
 
            oUploadSet.getItems().forEach(function (oItem) {
                if (oItem.getListItem().getSelected()) {
                    oItem.download(true);
                }
            });
        },
        onSelectionChange: function() {
            var oUploadSet = this.byId("UploadSet");
            // If there's any item selected, sets version button enabled
            if (oUploadSet.getSelectedItems().length > 0) {
                if (oUploadSet.getSelectedItems().length === 1) {
                    this.byId("versionButton").setEnabled(true);
                } else {
                    this.byId("versionButton").setEnabled(false);
                }
            } else {
                this.byId("versionButton").setEnabled(false);
            }
        },
        onVersionUpload: function(oEvent) {
            var oUploadSet = this.byId("UploadSet");
            this.oItemToUpdate = oUploadSet.getSelectedItem()[0];
            oUploadSet.openFileDialog(this.oItemToUpdate);
        },
       
        _getItemData: function(oItem) {
            // generate a 6 digit random number as id
            const iId = Math.floor(Math.random() * 1000000);
            const oFileObject = oItem.getFileObject();
            return {
                id: iId,
                fileName: oItem?.getFileName(),
                uploaded: new Date(),
                uploadedBy: "John Doe",
                mediaType: oFileObject.type,
                // URL to the uploaded file from blob.
                url: oItem?.getUrl() ? oItem?.getUrl() : URL.createObjectURL(oFileObject),
                statuses: [
                    {
                        "title": "Uploaded By",
                        "text": "Jane Burns",
                        "active": true
                    },
                    {
                        "title": "Uploaded On",
                        "text": "Today",
                        "active": false
                    }
                ]
            };
        }
       
       
 
 
        });
    });