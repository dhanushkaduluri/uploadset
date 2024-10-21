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
					console.log(oJSONModel,"hii");
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
			oUploadSet.attachUploadCompleted(this.onUploadCompleted.bind(this));
        },
        onAfterItemAdded: function (oEvent) {
            // Get the UploadSet control
            const oUploadSet = oEvent.getSource();

            // Get the parameters of the event
            const oParameters = oEvent.getParameters();

            // Get the item that was just added
            const oItem = oParameters.item;

            // Display a message
            console.log("File added: " + oItem.getFileName());
        },

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
		onUploadCompleted: function(oEvent) {
			// this.oItemToUpdate = null;
			// this.byId("versionButton").setEnabled(false);
			// // add item to the model
			// var oItem = oEvent.getParameter("item");
			// var oModel = this.getView().getModel();
			// var aItems = oModel.getProperty("/items");
			// var oItemData = this._getItemData(oItem);
			// aItems.unshift(oItemData);
			// oModel.setProperty("/items", aItems);
			// oModel.refresh();
		},
		onAfterItemRemoved: function(oEvent) {
			// remove item from the model
			// var oItem = oEvent.getParameter("item");
			// var oModel = this.getView().getModel();
			// var aItems = oModel.getProperty("mediafile");
			// var oItemData = oItem?.getBindingContext()?.getObject();
			// var iIndex = aItems.findIndex((item) => {
			// 	return item.id == oItemData?.id;
			// });
			// if (iIndex > -1) {
			// 	aItems.splice(iIndex, 1);
			// 	oModel.setProperty("/items", aItems);
			// }
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
