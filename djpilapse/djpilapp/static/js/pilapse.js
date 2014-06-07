    function formvalues(formid){
        var values = {};
        $.each($(formid).serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        return values
    }

    function baseurl() {
        path=document.URL
        path=path.replace( "djpilapp/", "" )
        path=path.replace( "#", "" )
        return path
    };

    function loadImage() {
        $('#imageFrame').fadeTo('fast', 0.5);
        path=baseurl()+"static/new.jpg"
        //width=320;
        //height=240;
        target='#imageFrame';
        X=$('<img src="'+ path +'" id="lastImage" class="img-responsive">')//.width(width).height(height);
        $(target).html(X);
        $('#imageFrame').fadeTo('fast', 1.0);
    }

    function saveProjSettings() {
        vals=formvalues('#projectForm')
        $.ajax(
            url=baseurl()+"djpilapp/saveproj/",
            settings={ 
              data:vals,
              type:"POST"
            }
        );
    }


    //Stack to place requests to the server on.
    functionStack=[]

    $(document).ready( function(){
        //Navigation buttons.
        $('.photoButton').click(function(){
            vals=formvalues('#photoForm')
            iso=vals['formiso']
            ss=vals['formshutterspeed']
            url=baseurl()+'djpilapp/shoot/'+ss+'/'+iso+'/'
            console.log(url)
            waittime=ss/1000+500
            $.ajax(url).done( function(){
                $('#imageFrame').fadeTo('fast', 0.5);
                setTimeout(function(){
                    functionStack.push( loadImage );
                },waittime);
            });
        });
        $('#alertBox').hide()
        $('.refreshButton').click(function(){
            functionStack.push( loadImage );
        });
        $('.projSaveButton').click(function(){
            functionStack.push( saveProjSettings );
        });

        $('#overviewBtn').click(function(){
            event.preventDefault();
            $('#newProject').hide();
            $('#overview').show();
        });
        $('#newProjectBtn').click(function(){
            event.preventDefault();
            $('#overview').hide();
            $('#newProject').show();
        });
        $('.calibrateButton').click(function(){
            url=baseurl()+'djpilapp/findinitialparams/'
            $.ajax(url);
        });
        $('.lapseButton').click(function(){
            url=baseurl()+'djpilapp/startlapse/'
            $.ajax(url);
        });
        $('.deactivateButton').click(function(){
            url=baseurl()+'djpilapp/deactivate/'
            $.ajax(url);
        });

        $('#confirm_box').toggle()

        $('.rebootButton').click(function(){
            $('#confirm_box').html(
            "Are you sure you want to reboot?<br /><button class='btn btn-danger' id='rebootReal'>Reboot</button>")
            $('#confirm_box').toggle()
            $('#rebootReal').click(function(){
                url=baseurl()+'djpilapp/reboot/'
                $.ajax(url);
            });
        });

        $('.poweroffButton').click(function(){
            $('#confirm_box').html(
            "Are you sure you want to power down?<br /><button class='btn btn-danger' id='poweroffReal'>Power Off</button>")
            $('#confirm_box').toggle()
            $('#poweroffReal').click(function(){
            url=baseurl()+'djpilapp/poweroff/'
                $.ajax(url);
            });
        });

        $('.deleteButton').click(function(){
            $('#confirm_box').html(
            "Are you sure you want to delete all stored pictures?<br /><button class='btn btn-danger' id='deleteReal'>Delete All</button>")
            $('#confirm_box').toggle()
            $('#deleteReal').click(function(){
            url=baseurl()+'djpilapp/deleteall/'
                $.ajax(url);
            });
        });


        //Page Updates
        setInterval(function() {
            if (functionStack.length>0) {
                f = functionStack.pop();
                //console.log(f);
                f();
            }
            else {
                path=baseurl()+'djpilapp/jsonupdate/';
                $.ajax(
                  url=path,
                  settings={
                  dataType: "json",
                  success: function(data){
                      if (data['lastshot']!=$('#pilapse_lastshot').html()){
                          functionStack.push( loadImage );
                      };
                      $('#alertBox').hide()
                      $('#jsontarget').html(data['time']);
                      $('#diskfree').html(data['diskfree']);
                      $('#pilapse_ss').html(data['ss']);
                      $('#pilapse_iso').html(data['iso']);
                      $('#pilapse_lastbr').html(data['lastbr']);
                      $('#pilapse_avgbr').html(data['avgbr']);
                      $('#pilapse_status').html(data['status']);
                      $('#pilapse_shots').html(data['shots']);
                      $('#pilapse_lastshot').html(data['lastshot']);
                      $('#project_interval').html(data['interval']);
                      $('#project_brightness').html(data['brightness']);
                      $('#project_width').html(data['width']);
                      $('#project_height').html(data['height']);
                      $('#project_delta').html(data['delta']);
                      $('#project_brightness').html(data['brightness']);
                      if (data['active']==false){
                          $('#pilapse_active').html('False');
                          $('.activebutton').fadeTo(0.5, 1.0);
                          $('.activebutton').removeClass('btn-disabled');
                      } else { 
                          $('#pilapse_active').html('True');
                          $('.activebutton').fadeTo(0.5, 0.2);
                          $('.activebutton').addClass('btn-disabled');
                      };
                    },
                  error: function(data){ $('#alertBox').show() }
                });
              }
        }, 2000);
    });
