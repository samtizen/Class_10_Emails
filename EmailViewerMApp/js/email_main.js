/*
 * File: email_main.js
 * Application: Email Manager
 * Author: Sergei Papulin
 * 
 * Messaging:
 * https://developer.tizen.org/development/guides/web-application/messaging/messages
 * https://developer.tizen.org/ko/development/api-references/web-application?redirect=/dev-guide/2.3.0/org.tizen.web.apireference/html/device_api/mobile/tizen/messaging.html&langredirect=1
 * 
 * Filter:
 * https://developer.tizen.org/development/guides/web-application/data-storage-and-management/data-filtering-and-sorting?langredirect=1
 * https://developer.tizen.org/development/api-references/web-application?redirect=/dev-guide/3.0.0/org.tizen.web.apireference/html/device_api/mobile/tizen/tizen.html
 * 
 * AppControl
 * https://developer.tizen.org/ko/development/api-guides/web-application/tizen-features/application-framework/application?langredirect=1
 * https://developer.tizen.org/ko/development/guides/web-application/tizen-features/application/application/common-application-controls?langredirect=1
 * 
 * Contacts:
 * https://developer.tizen.org/ko/development/guides/web-application/personal-data/contacts
 * https://developer.tizen.org/ko/development/api-references/web-application?redirect=/dev-guide/latest/org.tizen.web.apireference/html/device_api/mobile/tizen/contact.html&langredirect=1
 * 
 * Email Account:
 * https://help.mail.ru/mail-help/mailer/popsmtp
 * 
 * Icons: 
 * http://www.flaticon.com/
 * 
 */

(function(){
	
	var emailMain = {},
		emailTizen,
		emailView;
	
	emailMain.init = function() {
		
		emailView = new EmailView();
		emailTizen = new EmailTizen();
		
		//Page 1: Основная страница с письмами из INBOX - email-viewer-main
		$("#email-viewer-main").on("pagebeforeshow", pagebeforeshowEmailMainPage);
		$("#btn-email-sync").click(syncEmails);
		$("#ls-email-main").on("click", ".ui-email-item", showEmailDetailPage);
		$("#btn-show-new-email-page").click(showNewEmailPage);
		$("#btn-email-delete-main-page").click(removeEmailMailPage); //  <--- ВАШ КОД
		$("#ls-email-main").on("click", ".ui-email-item-checkbox", getCheckedEmailsMainPage); //  <--- ВАШ КОД
		
		
		emailTizen.init(30, "INBOX", emailView.refreshEmailList, emailView.addEmailList);
		
		//Page 2: Страница для создания нового сообщения - email-viewer-new-email-page
		$("#email-viewer-new-email-page").on("pagebeforeshow", pagebeforeshowNewEmailPage);
		$("#btn-email-send-new-email-page").click(sendNewEmail);
		$("#btn-back-to-main-from-new-email-page").click(backToMainFromNewEmailPage);
		$("#btn-add-contact-new-email-page").click(addContactNewEmailPage);
		
		//Page 3: Страница для ответа на сообщение - email-viewer-reply-page
		$("#email-viewer-reply-page").on("pagebeforeshow", pagebeforeshowEmailReplyPage);
		$("#btn-email-send-reply-page").click(sendReplyEmail);
		$("#btn-back-to-message-from-reply-page").click(backToMessagePageFromReplyPage);
		
		//Page 4: Страница для чтения сообщения - email-viewer-view-page
		$("#email-viewer-view-page").on("pagebeforeshow", pagebeforeshowEmailMessagePage);
		$("#btn-back-to-main-from-view-page").click(backToMainFromMessagePage);
		$("#btn-email-reply-view-page").click(showEmailReplyPage);
		$("#btn-email-delete-view-page").click(removeEmailReplyPage); //  <--- ВАШ КОД
		
		//Page 0:
		/*$("#btn-get-email-service").click(getEmailService);
		$("#btn-send-email").click(sendEmail);
		$("#btn-get-folders").click(getFolders);
		$("#btn-get-emails").click(getEmails);
		$("#btn-sync-emails").click(syncEmails);*/
	}
	
	//Page 1: Основная страница с письмами из INBOX - email-viewer-main
	function keyboardShowHandler() {
		
		console.log("keyboard is active");
		
	}
	function pagebeforeshowEmailMainPage() {
		
		$("#email-viewer-new-email-page").css("display", "none");
		$("#email-viewer-reply-page").css("display", "none");
		$("#email-viewer-view-page").css("display", "none");
		$(this).css("display", "block");
	}
	function syncEmails() {
		
		emailTizen.syncEmailFolder("INBOX");
		
	}
	function showEmailDetailPage() {
		
		var emailId = this.id.split("_")[1];
		
		emailTizen.getEmail(emailId, emailView.addEmail);
		
		tau.changePage("email-viewer-view-page", {transition: "flip", reverse: false});
	}
	function showNewEmailPage() {
		
		tau.changePage("email-viewer-new-email-page", {transition: "flip", reverse: false});
		
	}
	function removeEmailMailPage() {
		
		//ВАШ КОД
		
	}
	function getCheckedEmailsMainPage() {
		
		//ВАШ КОД
		
	}
	
	//Page 2: Страница для создания нового сообщения - email-viewer-new-email-page
	function pagebeforeshowNewEmailPage() {
		
		$("#email-viewer-reply-page").css("display", "none");
		$("#email-viewer-main").css("display", "none");
		$("#email-viewer-view-page").css("display", "none");
		$(this).css("display", "block");
	}
	function sendNewEmail() {
		
		var fromMsg = emailTizen.getMyEmail(),
			subjectMsg = $("#txt-email-subject-new-email-page").val(),
			textMsg = $("#txt-email-message-new-email-page").val(),
			toEmails = convertEmailStringToArray($("#txt-email-to-new-email-page").val());
		
		emailTizen.sendEmail(toEmails, fromMsg, subjectMsg, textMsg, function() {
			
			backToMainFromNewEmailPage();
			
		});
	}
	function convertEmailStringToArray(strEmails) {
		
		if(strEmails) {
		
			var arrStrEmails = strEmails.split(","),
				i = 0, 
				lenList = arrStrEmails.length,
				toEmails = [];
			
			for (i; i < lenList; i++) {
				toEmails[i] = $.trim(arrStrEmails[i]);
			}
			
			return toEmails;
		}
		
		return [];
		
	}
	function convertEmailArrayToString(arrEmails) {
		
		return arrEmails.join();
		
	}
	function backToMainFromNewEmailPage() {
		
		$("#txt-email-to-new-email-page").val("");
		$("#txt-email-subject-new-email-page").val("");
		$("#txt-email-message-new-email-page").val("");
		
		tau.changePage("email-viewer-main", {transition: "flip", reverse: false});
		
	}
	function addContactNewEmailPage() {
		
		var appDataSelectMode = new tizen.ApplicationControlData("http://tizen.org/appcontrol/data/selection_mode", ["multiple"]),
			appDataType = new tizen.ApplicationControlData("http://tizen.org/appcontrol/data/type", ["id"]),
			appData = [appDataSelectMode, appDataType]; 
		
		var appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/pick", 
													  null, 
													  "application/vnd.tizen.contact",
													  null, 
													  appData, 
													  null);
		
		var callbackAppControl = {
				onsuccess: onsuccessCallbackAppControl,
				onfailure: onerrorCallbackAppControl
		};
		
		tizen.application.launchAppControl(appControl, null, onsuccessLaunch, onerrorLaunch, callbackAppControl);
		
		function onsuccessLaunch() {
			
			console.log("Contact Picker was launched successfully");
			
		}
		function onerrorLaunch(e) {
			
			console.log(e);
			
		}
		function onsuccessCallbackAppControl(data) {
			
			var i = 0,
				lenList = data.length;
			
			console.log(data);
			
			for (i; i < lenList; i++) {
				
				/*if (data[i].key == "http://tizen.org/appcontrol/data/type") {
					console.log("type: " + data[i].value[0]);
				}
				*/
				
				if (data[i].key == "http://tizen.org/appcontrol/data/selected")
	            {
					
					var addressbook = tizen.contact.getDefaultAddressBook();
					
					/*var filter = new tizen.AttributeFilter("id", "CONTAINS", "");
					addressbook.find(onsuccessFindContacts, null, filter, null);

					function onsuccessFindContacts(contacts) {
						
						var i = 0,
							lenList = contacts.length;
						
						for (i; i < lenList; i++) {
							console.log(contacts[i].id + ":" + contacts[i].personId + ":" + contacts[i].groupIds + ":" + contacts[i].emails[0].email);
						}
						
					}*/
					
					
					var j = 0,
						lenList_2 = data[i].value.length,
						toEmails = convertEmailStringToArray($("#txt-email-to-new-email-page").val());
					
					for (j; j < lenList_2; j++) {
						
						toEmails.push(addressbook.get(data[i].value[j]).emails[0].email);	
					}
					
					console.log(toEmails);
					
					$("#txt-email-to-new-email-page").val(convertEmailArrayToString(toEmails));
	            }
				
			}
			
		}
		function onerrorCallbackAppControl() {
			console.log("onerrorCallbackAppControl failed!");
		}
	}
	
	//Page 3: Страница для ответа на сообщение - email-viewer-reply-page
	function pagebeforeshowEmailReplyPage() {
		
		$("#email-viewer-new-email-page").css("display", "none");
		$("#email-viewer-main").css("display", "none");
		$("#email-viewer-view-page").css("display", "none");
		$(this).css("display", "block");	
		
	}
	function backToMessagePageFromReplyPage() { 
		
		$("#txt-email-to-reply-page").val("");
		$("#txt-email-subject-reply-page").val("");
		$("#txt-email-message-reply-page").val("");
		
		tau.changePage("email-viewer-view-page", {transition: "flip", reverse: false});
		
	}
	function sendReplyEmail() {
		
		var arrEmails = $("#txt-email-to-reply-page").val().split(","),
			fromMsg = emailTizen.getMyEmail(),
			subjectMsg = $("#txt-email-subject-reply-page").val(),
			textMsg = $("#txt-email-message-reply-page").val(),
			toEmails = [];
		
		
		var i = 0, 
			lenList = arrEmails.length;
			
		for (i; i < lenList; i++) {
			toEmails[i] = $.trim(arrEmails[i]);
		}
		
		console.log(toEmails);
		
		emailTizen.sendEmail(toEmails, fromMsg, subjectMsg, textMsg, function() {
			
			backToMainFromMessagePage();
			
		});
		
	}
	
	//Page 4: Страница для чтения сообщения - email-viewer-view-page
	function pagebeforeshowEmailMessagePage() {
		
		$("#email-viewer-new-email-page").css("display", "none");
		$("#email-viewer-reply-page").css("display", "none");
		$("#email-viewer-main").css("display", "none");
		$(this).css("display", "block");
	}
	function backToMainFromMessagePage() {
		
		$("#txt-email-from-view-page").val("");
		$("#txt-email-subject-view-page").val("");
		$("#txt-email-message-view-page").val("");
		
		tau.changePage("email-viewer-main", {transition: "flip", reverse: false});
	}
	function showEmailReplyPage() {
		
		$("#txt-email-to-reply-page").val($("#txt-email-from-view-page").val());
		$("#txt-email-subject-reply-page").val("RE: " + $("#txt-email-subject-view-page").val());
		$("#txt-email-message-reply-page").val(getFormattedTextForReply());
		
		tau.changePage("email-viewer-reply-page", {transition: "flip", reverse: false});
	}
	function removeEmailReplyPage() {
		
		//ВАШ КОД
	}
	
	function getFormattedTextForReply() {
		
		var lines = $("#txt-email-message-view-page").val().split("\n"),
			i = 0,
			lenList = lines.length,
			copyText = "";
		
		copyText = "\n\n>" + $("#txt-email-date-view-page").val()  + "\n";
		
		for (i; i < lenList; i++) {
		 
			copyText += ">" + lines[i] + "\n";
			
		}
		
		return copyText;
	}
	
	/*
	var emailService;
	
	function getEmailService() {
		
		console.log("getEmailService");
		
		tizen.messaging.getMessageServices("messaging.email", onsuccessService, onerrorService);
		
		function onsuccessService(services) {
			
			console.log("Success");
			console.log(services);
			
			
			
			emailService = services[0];
			
			console.log(emailService.messageStorage);
			
			var messageChangeCallback =
			{
				messagesupdated: function(msgs)
				{
					console.log("UPDATE");
					console.log(msgs.length + " message(s) updated");
					
					var i = 0,
					lenList = msgs.length;
				
					for (i; i < lenList; i++) {
						
						console.log("id:" + msgs[i].id + " cid:" + msgs[i].cid + " to:" + msgs[i].to + " from:" + msgs[i].from +
								" folderId:" + msgs[i].folderId + " type:" + msgs[i].type + " isRead:" + msgs[i].isRead);
					}
					
				},
				
				messagesadded: function(msgs)
				{ 
					
					console.log("ADD");
					console.log(msgs.length + " message(s) added");
					
					var i = 0,
						lenList = msgs.length;
					
					for (i; i < lenList; i++) {
						
						console.log("id:" + msgs[i].id + " cid:" + msgs[i].cid + " to:" + msgs[i].to + " from:" + msgs[i].from +
								" folderId:" + msgs[i].folderId + " type:" + msgs[i].type + " isRead:" + msgs[i].isRead);
					}
					
				},
				messagesremoved: function(msgs)
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
			};
			
			emailService.messageStorage.addMessagesChangeListener(messageChangeCallback);
			
		}
		
		function onerrorService(e) {
			console.log("Error");
			console.log(e);
		}
		
	}
	
	function sendEmail() {
		
	   var msg = new tizen.Message("messaging.email", 
			   {
			      to: ["papulin_hse@mail.ru"]
			   });
		
		
		emailService.sendMessage(msg, onsuccessSend, onerrorSend); 
		
		function onsuccessSend() {
			
			console.log("success");
			
		}
		
		function onerrorSend(e) {
			
			console.log(e);
			
		}
		
	}
	
	function getEmails() {
		
		var filter = new tizen.AttributeFilter("id", "EXISTS");
		
		emailService.messageStorage.findMessages(filter, onsuccessFind);
		
		function onsuccessFind(msgs){
			
			console.log(msgs);
			
			var i = 0,
				lenList = msgs.length;
			
			for (i; i < lenList; i++) {
				
				console.log(msgs[i].id);
				console.log(msgs[i].to);
				console.log(msgs[i].from);
				console.log(msgs[i].folderId);
				console.log(msgs[i].type);
				console.log(msgs[i].isRead);
				
			}
			
		}
		
	}
	
	function getFolders() {
		
		var filter = new tizen.AttributeFilter("serviceId", "EXACTLY", 1);
		
		emailService.messageStorage.findFolders(filter, onsuccessFind, onerrorFind);
		
		function onsuccessFind(dirs) {
			
			
			console.log("FOLDERS");
			console.log(dirs);
			var i = 0,
				lenList = dirs.length;
			
			for (i; i < lenList; i++) {
				
				console.log("id:" + dirs[i].id + " type:" + dirs[i].type);
			
			}
			
		}
		
		function onerrorFind(e) {
			
			console.log(e);
			
		}

		
	}
	
	function syncEmails() {
		
		emailService.sync(onsuccessSync, onerrorSync, 10);
		
		function onsuccessSync() {
			
			console.log("Sync: OK");
			
			
		}
		
		function onerrorSync(e) {
			
			console.log("Sync: Failed");
			console.log(e);
			
			alert("Sync: Failed");
			
		}
		
	}
	function syncEmailFolder() {
		
		var filter = new tizen.AttributeFilter("serviceId", "EXISTS");
		
		emailService.messageStorage.findFolders(filter, folderQueryCallback); 
		
	}*/
	

	return emailMain;
	
})().init();