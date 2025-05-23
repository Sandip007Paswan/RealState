public class calenderinvite_ApxCls {
	public static Blob doIcsAttachment(String uid,DateTime startDate, DateTime endDate, String location, String body, String subject,Map<String,String> eml_Names,Integer Sequence) {
           
       // Build date strings
        String startDateString = '';
        startDateString += startDate.year();
        startDateString += ('0' + startDate.month()).right(2);
        startDateString += ('0' + startDate.day()).right(2);
        startDateString += 'T';
        startDateString += ('0' + startDate.hour()).right(2);
        startDateString += ('0' + startDate.minute()).right(2);
        startDateString += ('0' + startDate.second()).right(2);
        startDateString += 'Z';
    
        String endDateString = '';
        endDateString += endDate.year();
        endDateString += ('0' + endDate.month()).right(2);
        endDateString += ('0' + endDate.day()).right(2);
        endDateString += 'T';
        endDateString += ('0' + endDate.hour()).right(2);
        endDateString += ('0' + endDate.minute()).right(2);
        endDateString += ('0' + endDate.second()).right(2);
        endDateString += 'Z';

        String nowString = '';
        Datetime nowDT = Datetime.now();
        nowString += nowDT.year();
        nowString += ('0' + nowDT.month()).right(2);
        nowString += ('0' + nowDT.day()).right(2);
        nowString += 'T';
        nowString += ('0' + nowDT.hour()).right(2);
        nowString += ('0' + nowDT.minute()).right(2);
        nowString += ('0' + nowDT.second()).right(2);
        nowString += 'Z';
		
        System.debug('startDateString'+startDateString);
        System.debug('endDateString'+endDateString);
        String txtInvite = '';
        txtInvite += 'BEGIN:VCALENDAR\n';
        txtInvite += 'PRODID:-//Google Inc//Google Calendar 70.9054//EN\n';
        txtInvite += 'VERSION:2.0\n';
        txtInvite += 'CALSCALE:GREGORIAN\n';
        txtInvite += 'X-MS-OLK-FORCEINSPECTOROPEN:TRUE\n';
        txtInvite += 'X-WR-TIMEZONE:Asia/Manila\n';
        txtInvite += 'METHOD:REQUEST\n';
        txtInvite += 'BEGIN:VEVENT\n';
        txtInvite += 'DTSTART;TZID=Asia/Manila:' + startDateString + '\n';
        txtInvite += 'DTEND;TZID=Asia/Manila:' + endDateString + '\n';
        txtInvite += 'DTSTAMP:' + startDateString + '\n';
        txtInvite += 'ORGANIZER;CN=' + UserInfo.getUserName() + ':MAILTO:' + UserInfo.getUserEmail() + '\n';
        txtInvite += 'UID:'+uid+'\n';// + String.valueOf(Crypto.getRandomLong()) + '\n';
        Integer count=0;
        for( String key : eml_Names.keySet()){
            txtInvite += 'ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=\n';
        	txtInvite += ' TRUE;X-NUM-GUESTS='+count+':mailto:'+key+'\n';
        }
        txtInvite += 'CREATED:' + nowString + '\n';
        txtInvite += 'DESCRIPTION:' + body + '\n';
        txtInvite += 'LAST-MODIFIED:' + nowString + '\n';
        txtInvite += 'LOCATION:Salesforce Team \n';
        txtInvite += 'SEQUENCE:'+Sequence+'\n';
        txtInvite += 'STATUS:CONFIRMED\n';
        txtInvite += 'SUMMARY:' + subject + '\n';
        txtInvite += 'TRANSP:OPAQUE\n';
        txtInvite += 'END:VEVENT\n';
        txtInvite += 'END:VCALENDAR\n';
    
        return Blob.valueOf(txtInvite);
    }
}