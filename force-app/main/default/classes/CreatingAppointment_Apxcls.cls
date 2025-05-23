public class CreatingAppointment_Apxcls {

   public static void storeDetails(String dt) {
       data wrap = (data)System.JSON.deserialize(dt,data.class);
       System.debug('wrap'+wrap);
   }
   public class data{
        public String propertyId;
        public String countryId;
		public String stateId;
        public String cityId;
        public String salutation;
		public String firstName;
        public String lastName;
        public String phn;
		public String email;
        public DateTime DatTime;
        public String sndEmail;
    }

}