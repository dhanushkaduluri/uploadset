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
           
            var oUploadSet = this.byId("UploadSet");
 
           
 
            // Modify "add file" button
            oUploadSet.getDefaultFileUploader().setButtonOnly(false);
            oUploadSet.getDefaultFileUploader().setTooltip("");
            oUploadSet.getDefaultFileUploader().setIconOnly(true);
            oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
        },
        
        onAfterItemAdded: async function (oEvent) {
            const oUploadSet = this.byId("UploadSet");
            const oItem = oEvent.getParameter("item");
        
            // Access the model from the upload set
            const oDataModel = oUploadSet.getModel();
        
            // Store file metadata
            this.fileName = oItem.getFileName();
            this.mediaType = oItem.getMediaType();
            this.size = oItem.getFileObject().size;
        
            const reader = new FileReader();
        
            reader.onload = async (e) => {
                // Get binary data as an ArrayBuffer
                const binaryData = e.target.result;
                const byteArray = new Uint8Array(binaryData);
        
                const sServiceUrl = oDataModel.sServiceUrl;
        
                // Prepare upload data for POST request
                const oUploadData = {
                    mediaType: this.mediaType,
                    fileName: this.fileName,
                    size: this.size,
                };
        
                try {
                    // Perform the Fetch POST request to create the media record
                    const postResponse = await fetch(`${sServiceUrl}/MediaFile`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(oUploadData),
                    });
        
                    if (!postResponse.ok) {
                        throw new Error("POST request failed.");
                    }
        
                    const postData = await postResponse.json();
                    const mediaId = postData.d.id; // Get the ID of the newly created media
        
                    // Now prepare to update the content with a PUT request
                    const putResponse = await fetch(`${sServiceUrl}/MediaFile(${mediaId})/content`, {
                        method: 'PUT',
                        body: byteArray, // Updated content
                    });
        
                    if (!putResponse.ok) {
                        throw new Error("PUT request failed.");
                    }
        
                    console.log("Media content updated successfully.");
                    oDataModel.refresh(true);
                } catch (error) {
                    console.log("fileUploadErr", error.message || "Upload failed.");
                }
            };
        
            // Read the file as an ArrayBuffer (triggers the onload event)
            if (oItem._oFileObject) {
                reader.readAsArrayBuffer(oItem._oFileObject);
            } else {
                console.log("No file object found");
            }
        }
,        
       
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
       
        onAfterItemRemoved: async function (oEvent) {
            const oRemovedItem = oEvent.getParameter("item"); // Get the item removed
            const sUrl = oRemovedItem.getProperty("url"); // Get the URL from the item
        
            // Extract the ID from the URL
            const mediaId = this.extractIdFromUrl(sUrl);
            if (!mediaId) {
                console.error("Unable to extract ID from URL:", sUrl);
                return;
            }
        
            try {
                const oUploadSet = this.byId("UploadSet");
                const sServiceUrl = oUploadSet.getModel().sServiceUrl;
        
                // Perform the DELETE request
                const deleteResponse = await fetch(`${sServiceUrl}/MediaFile(${mediaId})`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!deleteResponse.ok) {
                    throw new Error("Failed to delete media item from server.");
                }
                oUploadSet.removeItem(oRemovedItem);
                console.log("Media item successfully deleted from the server.");
        
            } catch (error) {
                console.error("Error deleting media item:", error.message);
            }
        },
        
        // Reusable helper method to extract ID from URL
        extractIdFromUrl: function (url) {
            const regex = /MediaFile\(([^)]+)\)/; // Regular expression to match the ID
            const match = url.match(regex);
            return match ? match[1] : null; // Return the ID or null if not found
        }
        
 
 
        });
    });