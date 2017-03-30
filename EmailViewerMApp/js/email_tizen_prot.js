EmailTizen = (function() {
	
	function EmailTizen() {
		
		this.emailService = null;
		this.folders = {};
		
	}
	
	EmailTizen.prototype = {
			
			init : function(limitNumEmails, folder, callbackView, callbackViewAddEmailSync) {
				
				var self = this;
				
				tizen.messaging.getMessageServices("messaging.email", onsuccessService, onerrorService);
				
				function onsuccessService(services) {
					
					//console.log("EmailTizen: init -> Success");
					//console.log(services);
					
					self.emailService = services[0];
					
					var messageChangeCallback =
						{
							messagesupdated: onmessageUpdate,
							messagesadded: onmessageAdd,
							messagesremoved: onmessageRemove
						};
					
					self.emailService.messageStorage.addMessagesChangeListener(messageChangeCallback);
					
					self.getFolders();
					self.getEmails(limitNumEmails, folder, callbackView);
					
				}
				
				function onerrorService(e) {
					console.log("Error");
					console.log(e);
				}
				
				function onmessageUpdate(msgs)
				{
					console.log("UPDATE");
					console.log(msgs.length + " message(s) updated");
					
					var i = 0,
					lenList = msgs.length;
				
					for (i; i < lenList; i++) {
						
						console.log("id:" + msgs[i].id + " cid:" + msgs[i].cid + " to:" + msgs[i].to + " from:" + msgs[i].from +
								" folderId:" + msgs[i].folderId + " type:" + msgs[i].type + " isRead:" + msgs[i].isRead);
					}
				}
				function onmessageAdd(msgs)
				{ 
					
					var i = 0,
						j = 0,
						lenList = msgs.length,
						inboxList = []; //inboxList неотсортированный массив новых входящих писем 
					
					for (i; i < lenList; i++) {
						
						if (self.folders["INBOX"] === msgs[i].folderId) {
							
							inboxList[j] = msgs[i];
							j++;
						}
					}
					
					callbackViewAddEmailSync(inboxList)
					
					console.log("ADD");
					console.log(inboxList.length + " message(s) added");
					
					var i = 0,
						lenList = inboxList.length;
					
					for (i; i < lenList; i++) {
						
						console.log("id:" + inboxList[i].id + " cid:" + inboxList[i].cid + " to:" + inboxList[i].to + " from:" + inboxList[i].from +
								" folderId:" + inboxList[i].folderId + " type:" + inboxList[i].type + " isRead:" + inboxList[i].isRead);
					}
					
				}
				function onmessageRemove(msgs)
				{
					console.log("REMOVE");
					console.log(msgs.length + " message(s) removed");
					
					var i = 0,
					lenList = msgs.length;
				
					for (i; i < lenList; i++) {
						
						console.log("id:" + msgs[i].id + " cid:" + msgs[i].cid + " to:" + msgs[i].to + " from:" + msgs[i].from +
								" folderId:" + msgs[i].folderId + " type:" + msgs[i].type + " isRead:" + msgs[i].isRead);
					}
				}
				
			},
			
			getEmails : function(limitNumEmails, folder, callbackView) {
				
				if (this.emailService != null) {
					
					var self = this, 
						filter = null,
						sortMode;
					
					sortMode = new tizen.SortMode("timestamp", "DESC");
					filter = new tizen.AttributeFilter("id", "EXISTS");
					
					this.emailService.messageStorage.findMessages(filter, onsuccessFind, null, sortMode);
					
					function onsuccessFind(msgs) {
						
						console.log(msgs);
						
						var i = 0,
							emailCount = 0,
							lenList = msgs.length,
							folderId = self.folders[folder],
							msgList = [];
						
						for (i; i < lenList; i++) {
							
							if (msgs[i].folderId === folderId) {
								
								msgList[emailCount] = msgs[i];
								
								emailCount++;
								
								if (emailCount > 30) {
									
									break;
									
								}
								
							}
						}
												
						callbackView(msgList);
						
					}
				}
			},
			
			getEmail : function(emailId, callbackView) {
				
				if (this.emailService != null) {
					
					var self = this,
						filter = null;
					
					filter = new tizen.AttributeFilter("id", "EXACTLY", emailId);
					
					this.emailService.messageStorage.findMessages(filter, onsuccessFind, null, null);
					
					function onsuccessFind(msgs) {
						
						if (msgs.length > 0) {
							
							console.log(msgs[0].body.plainBody);
							
							if (msgs[0].isRead == false) {
								
								msgs[0].isRead = true;
								self.emailService.messageStorage.updateMessages([msgs[0]], onsuccessUpdate, onerrorUpdate);
							
							}
							
							callbackView(msgs[0]);

							//self.emailService.loadMessageBody(msgs[0], onsuccessLoad, onerrorLoad);

							function onsuccessUpdate() {
								console.log("EmailTizen: getEmail -> updateMessages -> Success");
							}
							function onerrorUpdate(e) {
								console.log(e);
							}
							/*function onsuccessLoad(message) {
								console.log(message.isRead);
							}
							function onerrorLoad() {
								console.log(e);
							}*/
							
							
						}
						
					}
				}
				
			},
			
			getFolders : function() {
				
				if (this.emailService != null) {
				
					var self = this,
						filter = null;
					
					filter = new tizen.AttributeFilter("serviceId", "EXACTLY", this.emailService.id);
					
					this.emailService.messageStorage.findFolders(filter, onsuccessFind, onerrorFind);
					
					function onsuccessFind(dirs) {

						console.log("FOLDERS");
						console.log(dirs);
						
						var i = 0,
							lenList = dirs.length;
						
						for (i; i < lenList; i++) {
							
							self.folders[dirs[i].type] = dirs[i].id
							
							console.log("id:" + dirs[i].id + " type:" + dirs[i].type);
						
						}
						
					}
					
					function onerrorFind(e) {
						
						console.log(e);
						
					}
				}
				
			},
			
			syncEmails : function() {
				
				
			},
			
			syncEmailFolder : function(folder) {
				
				if (this.emailService != null) {
					
					var self = this,
						filter = null;
					
					filter = new tizen.AttributeFilter("serviceId", "EXACTLY", this.emailService.id);
					
					this.emailService.messageStorage.findFolders(filter, onsuccessFind, onerrorFind);
					
					function onsuccessFind(folders) {

						console.log(folders);
						
						var i = 0,
							lenList = folders.length;
						
						for (i; i < lenList; i++) {
							
							if (folders[i].type === folder) {
							
								self.emailService.syncFolder(folders[i], onsuccessSyncFolder, null, 30);
							
							}
							
							console.log("id:" + folders[i].id + " type:" + folders[i].type);
						
						}
						
						function onsuccessSyncFolder() {
							
							console.log("EmailTizen: syncEmailFolder -> Success");
						
						}
						
					}
					
					function onerrorFind(e) {
						
						console.log(e);
						
					}
				
				}
				
			},
			sendEmail : function(toMsg, fromMsg, subjectMsg, textMsg, callback) {
				
				if (this.emailService != null) {
				
					var msgObj = {
							subject: subjectMsg,
						    to: toMsg,
						    from: fromMsg,
						    plainBody: textMsg
					   }
					
					console.log(msgObj);
					
					//msgObj.body[plainBody] = textMsg;
					
					var msg = new tizen.Message("messaging.email", msgObj);
	
					this.emailService.sendMessage(msg, onsuccessSend, onerrorSend); 
					
					function onsuccessSend() {
						
						alert("Message was succcessfully sent!")
						console.log("success");
						
						callback();
						
					}
					
					function onerrorSend(e) {
						
						console.log(e);
						
					}
				}				
			},
			
			getMyEmail : function() {
				
				if (this.emailService != null) {
					
					var myEmail = this.emailService.name.split(" ")[1];
					
					return myEmail;
					
				}
				
				return null;
				
			}
			
		
	}
	
	
	
	return EmailTizen;
	
})();
