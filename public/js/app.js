//inject routerRoutes module to do routing
angular.module('socialApp', [])
 .config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
}]) 

.controller('reglogCtrl',function($http,$location,$scope,$compile){
    var self = this;


    //REGISTRATION
   this.Regist = function(){
      var self = this;
       
      self.preloader = true;
       
        this.RegData = {
              login:this.RegLogin,
              name:this.RegName,
              email:this.RegEmail,
              password:this.RegPassword
       };
       
       if(this.RegPassword == this.RegConfirmpass){
           
      // call to api
       $http({
           method:'POST',
           url:'http://localhost:3000/registration',
           data: this.RegData
       })
       
       .success(successGetting)
       .error(errorGetting)
       
    
       // function called when api call was a success
       function successGetting(res) {
           console.log('Succes', res);
           self.preloader = false;
           
       };
       
       // function called when api call gave an error
       function errorGetting (err){
           console.log('Somthing Wrong in send data');
       };
       //clear input
       this.RegLogin = null;
       this.RegName = null;
       this.RegEmail = null;
       this.RegPassword = null;
       this.RegConfirmpass = null;
           
       }
       else{
           console.log('Confirm password not tru');
       }
       
       
   };
    
//     LOGIN
    this.Logins = function (){
        this.LoginData = {
            
            logins: this.LogLogin,
            passwords: this.LogPassword
        }
         $http.post('http://localhost:3000/autorization', this.LoginData)
          .success((res) =>{
//            $location.path("profile");
            window.location.replace("/profile");
//              console.log(res.name);
         })
        .error(function(result){
         console.log('error');
        });
        //clear input
        this.LogLogin = null;
        this.LogPassword = null;
        
    };

    
    //PROFILE PAGE
    $http.get('http://localhost:3000/profile')
  
    
    //USERS DATA
    this.userData = function (){
        
        $http.get('http://localhost:3000/profile.json') 
        .success ((res) =>{
         this.UsersData = res;
         this.Userphoto = res.profilephoto;
         this.bio = res.bio;
         console.log(res);

         ServerChatMessage()

        });
     
};

    self.userData();

    
    //LOGOUT
    this.Logout= function(){
        $http.get('http://localhost:3000/logout')
        .success((res)=>{
             window.location.replace("/");
        })
    };
    
    
    
    //SAVE PROFILE INFO
    this.SaveProfileInfo = function(){
        
        this.ProfileInfo = {
            bio: this.bio,
            gender: this.gender,
            phone: this.phone,
            location: this.location
        };
        

        $http.post('http://localhost:3000/profileinfo', this.ProfileInfo)
        .success((res) =>{
            self.userData();
            console.log(res);
        });
        
    };

    
    //UPLOAD PHOTO 
    this.PhotoUpload = function(){
//        this.userData();
        
        var file = this.myFile;
        var uploadUrl = "http://localhost:3000/userphoto";
        var fd = new FormData();
        fd.append('file', file);
        
        $http.post(uploadUrl,fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(res){
             self.userData();
            console.log(res); 
        })
        .error(function(){
          console.log("error!!");

            
        });
      
    };




    
















    
    //USER IN CHAT
       

    this.MessageBox = function(){
      //message btn desibled
       this.typeMessage = true;
            
       $http.get('http://localhost:3000/friends')

        .success(function(res){

            self.userfriends = res;
          
        })
          .error(function(err){
            console.log('error');
        }) 

    };

    self.friendlogin;
    this.chooseFriendToMessage = function(id,logins){
       addTab(id,logins);
       CurentTabs(logins);

       this.friendslogin = logins;
       
      this.FriendsId = {

          friendid:id,
          friendlogin:logins
      }
      console.log(logins);
      $http.post('http://localhost:3000/choosefriendtomessage',this.FriendsId)
      .success(function(res){
            console.log(res);

      })

      .error(function(err){
        console.log('error');
      })
     
    }

    this.ChooseTabFriends = function(id,logins){
      self.friendslogin = logins;
     
      

      this.FriendsId = {

          friendid:id
      }
      //console.log(logins);
      // console.log(id);
      $http.post('http://localhost:3000/choosefriendtomessage',this.FriendsId)
      .success(function(res){
            console.log(res);
      })

      .error(function(err){
        console.log('error');
      })

    }


    //remove start message page 
    function removeStartMessage(){
      var startmessage = angular.element( document.querySelector( '#startmessage' ) );
      var startmessageContent = angular.element(document.querySelector('#startmessageContent'));
      startmessage.remove();
      startmessageContent.remove();
    };

    //add tabs 
    function addTab(id,logins){

          removeStartMessage();
            var userTabsid = id;
            //console.log('it is '+logins);
            var userTabslogin = logins;

          if (angular.element(document.querySelector('.'+logins+'')).length){
               console.log('element appended');
        }else{
            console.log('no element');
           
           var ChatusersTabs =  angular.element(document.querySelector('#ChatusersTabs'));
           var TabsElemnt = $compile('<li class="'+userTabslogin+'" ng-click="reglog.ChooseTabFriends(self.$index1='+userTabsid+',self.$index2=\'' +userTabslogin+ '\')"><a data-toggle="tab" href="#'+userTabslogin+'"> <button value="'+userTabslogin+'" class="close" type="button" ng-click="reglog.CloseTab($event)"> ×</button> '+userTabslogin+'</a></li>')($scope);
           ChatusersTabs.append(TabsElemnt);

           //add users work-space
           var ChatusersContent = angular.element(document.querySelector('#ChatusersContent'));
           ChatusersContent.append('<div id="'+userTabslogin+'" class="tab-pane fade"></div>');
        }
    };

//curentTabs
function CurentTabs(logins){

   //mesage btn undisabled
    self.typeMessage = false;

  var CurentTabs = angular.element(document.querySelector('.'+logins+''));
       CurentTabs.parent().children().removeClass('active');
        CurentTabs.addClass('active');

       var CurentTabsContent =  angular.element(document.querySelector('#'+logins+' '));
       CurentTabsContent.parent().children().removeClass('active in');
        CurentTabsContent.addClass('active in');
}
//Close Tabs
this.CloseTab = function(event){
     

   var id = event.target.value;

   var tabsid = angular.element(document.querySelector('.'+id+' '));
   var tabscontent  = angular.element(document.querySelector('#'+id+' '));

   var previousTabElement = tabsid[0].previousElementSibling;
   var previousTabContentElement = tabscontent[0].previousElementSibling;

   var previousTabContent =  angular.element(previousTabContentElement);
   var previousTab = angular.element(previousTabElement);

    tabsid.parent().children().removeClass('active');
    tabscontent.parent().children().removeClass('active in');


   previousTab.addClass('active');
   previousTabContent.addClass('active in');
  
   tabsid.remove();
   tabscontent.remove();
  
}



//SERVER CHAT MESSAGE
function ServerChatMessage(){
     //conect to socket 
    self.socket = io({transports: ['websocket']});

    self.socket.on('message', function (data) {
            console.log(data);

            renderServerMessage(data);

             renderClientMessage(data);
        });
}
     //send message 
    this.SendMessage = function(){
      this.data = {
        myroom:'yana21',
        rooms: self.friendslogin,
        message: this.messagetext
      }

      renderClientMessage(this.data);

       //console.log(this.data);
      self.socket.emit('message',this.data);

      //clear input 
      this.messagetext = ''; 
}

this.time =  new Date().toLocaleTimeString();
 function renderServerMessage(data){
      var id = data.rooms;
      var logins = data.nickname;

      addTab(id,logins);
      removeStartMessage();

    var userChatContent = angular.element(document.querySelector('#'+data.nickname+''));
     userChatContent.append('<h5>'+data.nickname+'</h5><p>'+data.message+'</p>');
 }

 function renderClientMessage(data){
     var userChatContent = angular.element(document.querySelector('#'+data.rooms+''));
     userChatContent.append('<h5>'+data.myroom+'</h5><p class="chatMessage">'+data.message+'<span class="pull-right">'+self.time+'</span></span>');
 }

   



















    //FRIENDS
    this.Friends = function(){
        //PEOPLE IN FACE2FACE
        $http.get('http://localhost:3000/users')
        
        .success(function(res){
            console.log(res);
           self.friends = res;
        })
        .error(function(err){
            console.log('error');
        })
        //USER FRIENDS
        $http.get('http://localhost:3000/friends')

        .success(function(res){
            console.log(res);
            self.userfriends = res;
          
        })
          .error(function(err){
            console.log('error');
        })      
        
        
    };

    //ADD FRIENDS
    this.AddFriends = function(id){
        
      this.friendsid = {
            friendid:id
      }
          
      console.log(id);

       $http.post('http://localhost:3000/addfriends' ,this.friendsid)
       .success(function(res){
            self.Friends();
            console.log(res);
        })
       .error(function(err){
            console.log('error');
        })    
    };

    
    
    
    
    
});
