EmailView = (function() {
	
	function EmailView() {
		
	}
	
	EmailView.prototype = {
			
			refreshEmailList : function(msgs) {
				
				var i = 0,
					lenList = msgs.length,
					strHtml = "";
				
				for (i; i < lenList; i++) {
					
					
					strHtml += '<div class="ui-email-item ' + checkReadStatus(msgs[i].isRead) + '" id="emailitem_' + msgs[i].id + '">' +
						'<p class="ui-email-item-topic">' +  checkSubject(msgs[i].subject) + '</p>' +
						'<p class="ui-email-item-from">' + msgs[i].from + '</p>' +
						'<p class="ui-email-item-date">' +  msgs[i].timestamp + '</p>' +
						'<input class="ui-checkbox ui-email-item-checkbox" type="checkbox" id="emaildel_'+ msgs[i].id + '"/>' +
					'</div>';
					
				}
				
				$("#ls-email-main").html(strHtml);
				
			},
			addEmailList : function(msgs) {
				
				var i = 0,
					lenList = msgs.length,
					strHtml = "";
				
				for (i; i < lenList; i++) {
					
					strHtml += '<div class="ui-email-item ' + checkReadStatus(msgs[i].isRead) + '" id="emailitem_' + msgs[i].id + '">' +
						'<p class="ui-email-item-topic">' +  checkSubject(msgs[i].subject) + '</p>' +
						'<p class="ui-email-item-from">' + msgs[i].from + '</p>' +
						'<p class="ui-email-item-date">' +  msgs[i].timestamp + '</p>' +
						'<input class="ui-checkbox ui-email-item-checkbox" type="checkbox" id="emaildel_'+ msgs[i].id + '"/>' +
					'</div>';
					
				}
				
				$("#ls-email-main").prepend(strHtml);
				
			},
			addEmail : function(msg) {
				
				$("#txt-email-date-view-page").val(msg.timestamp);
				$("#txt-email-from-view-page").val(msg.from);
				$("#txt-email-subject-view-page").val(msg.subject);
				$("#txt-email-message-view-page").val(msg.body.plainBody);
				
				var $item = $("#emailitem_" + msg.id);
				
				if ($item.hasClass("ui-email-unread-item"))
					$item.removeClass("ui-email-unread-item");
				
			}
			
			
	
				
	}
	function checkReadStatus(isread) {
		
		return (!isread) ? "ui-email-unread-item" : "";
	}
	function checkSubject(subject) {
		
		return (!subject) ? "None" : subject;
		
	}
	
	return EmailView;
	
})();