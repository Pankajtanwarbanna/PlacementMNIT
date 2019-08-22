
!function($) {
    "use strict";

    var CalendarApp = function() {
        this.$body = $("body")
        this.$calendar = $('#calendar'),
        this.$event = ('#calendar-events div.calendar-events'),
        this.$categoryForm = $('#add-new-event form'),
        this.$extEvents = $('#calendar-events'),
        this.$modal = $('#my-event'),
        this.$saveCategoryBtn = $('.save-category'),
        this.$calendarObj = null
    };


    /* on drop */
    /*CalendarApp.prototype.onDrop = function (eventObj, date) {
        var $this = this;
            // retrieve the dropped element's stored Event Object
            var originalEventObject = eventObj.data('eventObject');
            var $categoryClass = eventObj.attr('data-class');
            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);
            // assign it the date that was reported
            copiedEventObject.start = date;
            if ($categoryClass)
                copiedEventObject['className'] = [$categoryClass];
            // render the   event on the calendar
            $this.$calendar.fullCalendar('renderEvent', copiedEventObject, true);
            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                eventObj.remove();
            }
    },*/
    /* on click on event */
    CalendarApp.prototype.onEventClick =  function (calEvent, jsEvent, view) {
        var $this = this;
            var form = $("<form></form>");
            form.append("<label>Company</label>");
            form.append("<div class='input-group'><input class='form-control' type=text value='" + calEvent.title + "' /><span class='input-group-btn'></span></div>");
            $this.$modal.modal({
                backdrop: 'static'
            });
            $this.$modal.find('.delete-event').show().end().find('.save-event').hide().end().find('.modal-body').empty().prepend(form).end().find('.delete-event').unbind('click').click(function () {
                $this.$calendarObj.fullCalendar('removeEvents', function (ev) {
                    return (ev._id == calEvent._id);
                });
                $this.$modal.modal('hide');
            });
            $this.$modal.find('form').on('submit', function () {
                calEvent.title = form.find("input[type=text]").val();
                $this.$calendarObj.fullCalendar('updateEvent', calEvent);
                $this.$modal.modal('hide');
                return false;
            });
    }
    /* on select */
    /*CalendarApp.prototype.onSelect = function (start, end, allDay) {
        var $this = this;
            $this.$modal.modal({
                backdrop: 'static'
            });
            var form = $("<form></form>");
            form.append("<div class='row'></div>");
            form.find(".row")
                .append("<div class='col-md-6'><div class='form-group'><label class='control-label'>Event Name</label><input class='form-control' placeholder='Insert Event Name' type='text' name='title'/></div></div>")
                .append("<div class='col-md-6'><div class='form-group'><label class='control-label'>Category</label><select class='form-control' name='category'></select></div></div>")
                .find("select[name='category']")
                .append("<option value='bg-danger'>Danger</option>")
                .append("<option value='bg-success'>Success</option>")
                .append("<option value='bg-purple'>Purple</option>")
                .append("<option value='bg-primary'>Primary</option>")
                .append("<option value='bg-pink'>Pink</option>")
                .append("<option value='bg-info'>Info</option>")
                .append("<option value='bg-warning'>Warning</option></div></div>");
            $this.$modal.find('.delete-event').hide().end().find('.save-event').show().end().find('.modal-body').empty().prepend(form).end().find('.save-event').unbind('click').click(function () {
                form.submit();
            });
            $this.$modal.find('form').on('submit', function () {
                var title = form.find("input[name='title']").val();
                var beginning = form.find("input[name='beginning']").val();
                var ending = form.find("input[name='ending']").val();
                var categoryClass = form.find("select[name='category'] option:checked").val();
                if (title !== null && title.length != 0) {
                    $this.$calendarObj.fullCalendar('renderEvent', {
                        title: title,
                        start:start,
                        end: end,
                        allDay: false,
                        className: categoryClass
                    }, true);  
                    $this.$modal.modal('hide');
                }
                else{
                    alert('You have to give a title to your event');
                }
                return false;
                
            });
            $this.$calendarObj.fullCalendar('unselect');
    },*/
    /*CalendarApp.prototype.enableDrag = function() {
        //init events
        $(this.$event).each(function () {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };
            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);
            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });
        });
    }*/
    /* Initializing */
    CalendarApp.prototype.init = function() {
                    /*this.enableDrag();*/
        /*  Initialize the calendar  */
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var form = '';
        var today = new Date($.now());

        // start format - MM-DD-YYYY
        var defaultEvents =  [
            {
                title: 'Box8 Test (Except Software Developer Profile)',
                start: new Date('08-04-2019'),
                className: 'bg-info'
            }, {
                title: 'Hero Test',
                start: new Date('08-04-2019'),
                className: 'bg-info'
            },{
                title: 'Service Now Personal Interviews',
                start: new Date('08-04-2019'),
                className: 'bg-info'
            }, {
                title: 'Texas Personal Interviews',
                start: new Date('08-04-2019'),
                className: 'bg-info'
            },
            {
                title: 'Box8 Test',
                start: new Date('08-05-2019'),
                className: 'bg-info'
            }, {
                title: 'Texas Interview',
                start: new Date('08-05-2019'),
                className: 'bg-info'
            }, {
                title: 'Fidelity Online Test (2PM)',
                start: new Date('08-05-2019'),
                className: 'bg-info'
            },{
                title: 'JPMC PPT',
                start: new Date('08-05-2019'),
                className: 'bg-info'
            }, {
                title: 'Airtel Online Test',
                start: new Date('08-06-2019'),
                className: 'bg-info'
            }, {
                title: 'JPMC Personal Interviews',
                start: new Date('08-06-2019'),
                className: 'bg-info'
            }, {
                title: 'Future First Test : Morning',
                start: new Date('08-06-2019'),
                className: 'bg-info'
            }, {
                title: 'Airtel Personal Interviews',
                start: new Date('08-07-2019'),
                className: 'bg-info'
            }, {
                title: 'Samsung Test',
                start: new Date('08-07-2019'),
                className: 'bg-info'
            }, {
                title: 'Future First Interviews',
                start: new Date('08-07-2019'),
                className: 'bg-info'
            }, {
                title: 'InfoEdge Online Test',
                start: new Date('08-07-2019'),
                className: 'bg-info'
            },

            {
                title: 'Amazon PI',
                start: new Date('08-08-2019'),
                end: new Date('08-09-2019'),
                className: 'bg-info'
            }, {
                title: 'Lowes Test',
                start: new Date('08-08-2019'),
                className: 'bg-info'
            }, {
                title: 'Sociate General Test',
                start: new Date('08-08-2019'),
                className: 'bg-info'
            }, {
                title: 'Fidelity Personal Interviews',
                start: new Date('08-08-2019'),
                className: 'bg-info'
            },

            {
                title: 'Q E Systems',
                start: new Date('08-09-2019'),
                className: 'bg-info'
            }, {
                title: 'Tredence Test',
                start: new Date('08-09-2019'),
                className: 'bg-info'
            }, {
                title: 'InfoEdge Personal Interview',
                start: new Date('08-10-2019'),
                className: 'bg-info'
            }, {
                title: 'Sociate General Personal Interviews',
                start: new Date('08-10-2019'),
                className: 'bg-info'
            },

            {
                title: 'Duetsche Bank Test',
                start: new Date('08-11-2019'),
                className: 'bg-info'
            }, {
                title: 'Samsung Personal Interview',
                start: new Date('08-11-2019'),
                className: 'bg-info'
            }, {
                title: 'Walmart Test : Evening',
                start: new Date('08-11-2019'),
                className: 'bg-info'
            },

            {
                title: 'Axxela',
                start: new Date('08-12-2019'),
                className: 'bg-info'
            }, {
                title: 'Walmart Personal Interview',
                start: new Date('08-12-2019'),
                className: 'bg-info'
            },

            {
                title: 'Wisig',
                start: new Date('08-13-2019'),
                end: new Date('08-14-2019'),
                className: 'bg-info'
            },

            {
                title: 'Lowes Personal Interview ',
                start: new Date('08-13-2019'),
                className: 'bg-info'
            },

            {
                title: 'Deutsche Bank Personal Interview ',
                start: new Date('08-14-2019'),
                className: 'bg-info'
            },
            {
                title: 'MAQ Online Test ',
                start: new Date('08-14-2019'),
                className: 'bg-info'
            },

            {
                title: 'Increff',
                start: new Date('08-15-2019'),
                className: 'bg-info'
            },
            {
                title: 'Oracle',
                start: new Date('08-15-2019'),
                className: 'bg-info'
            },
            {
                title: 'OFSS',
                start: new Date('08-15-2019'),
                className: 'bg-info'
            },
			{
                title: 'InfoObject Test',
                start: new Date('08-16-2019'),
                className: 'bg-info'
            },
            {
                title: 'Trandence PI',
                start: new Date('08-16-2019'),
                className: 'bg-info'
            },
            {
                title: 'Philips Test',
                start: new Date('08-16-2019'),
                className: 'bg-info'
            },
            {
                title: 'MAQ PI',
                start: new Date('08-17-2019'),
                className: 'bg-info'
            },
			{
                title: 'Nokia Test',
                start: new Date('08-17-2019'),
                className: 'bg-info'
            },
            {
                title: 'Oracle PI',
                start: new Date('08-17-2019'),
                className: 'bg-info'
            },
            {
                title: 'OFSS PI',
                start: new Date('08-17-2019'),
                className: 'bg-info'
            },
			{
                title: 'Wissen Test + PI',
                start: new Date('08-17-2019'),
                className: 'bg-info'
            },
            {
                title: 'OYO Test',
                start: new Date('08-18-2019'),
                className: 'bg-info'
            },
			{
                title: 'Philips PI',
                start: new Date('08-19-2019'),
                className: 'bg-info'
            },
            {
                title: 'InfoObject PI',
                start: new Date('08-19-2019'),
                className: 'bg-info'
            },
	    {
                title: 'Commvault Test',
                start: new Date('08-19-2019'),
                className: 'bg-info'
            },
            {
                title: 'Dassault PPT',
                start: new Date('08-19-2019'),
                className: 'bg-info'
            },
            {
                title: 'Optum Test',
                start: new Date('08-19-2019'),
                className: 'bg-info'
            },
            {
                title: 'Dassault Test + PI',
                start: new Date('08-20-2019'),
                className: 'bg-info'
            },
            {
                title: 'Interra System',
                start: new Date('08-20-2019'),
                className: 'bg-info'
            },
            {
                title: 'Incture',
                start: new Date('08-21-2019'),
                className: 'bg-info'
            },
            {
                title: 'OYO PI',
                start: new Date('08-21-2019'),
                className: 'bg-info'
            },
            {
                title: 'Optum PI',
                start: new Date('08-21-2019'),
                className: 'bg-info'
            },
            {
                title: 'Deloitte Test',
                start: new Date('08-22-2019'),
                className: 'bg-info'
            },
            {
                title: 'NOKIA PI',
                start: new Date('08-22-2019'),
                className: 'bg-info'
            },
            {
                title: 'IndusValley Test',
                start: new Date('08-22-2019'),
                className: 'bg-info'
            },
            {
                title: 'Commvault PI',
                start: new Date('08-22-2019'),
                className: 'bg-info'
            },

            {
                title: 'Deloitte PI',
                start: new Date('08-23-2019'),
                className: 'bg-info'
            },
            {
                title: 'IndusValley PI',
                start: new Date('08-23-2019'),
                className: 'bg-info'
            },
            {
                title: 'BlackBuck',
                start: new Date('08-23-2019'),
                className: 'bg-info'
            },
            {
                title: 'Accenture',
                start: new Date('08-24-2019'),
                className: 'bg-info'
            },
            {
                title: 'Sarthee Tech. Test',
                start: new Date('08-24-2019'),
                className: 'bg-info'
            },

            {
                title: 'Publicis Sapient Test',
                start: new Date('08-25-2019'),
                className: 'bg-info'
            },
            {
                title: 'Sarthee Tech. PI',
                start: new Date('08-25-2019'),
                className: 'bg-info'
            },
            {
                title: 'REIL PI',
                start: new Date('08-25-2019'),
                className: 'bg-info'
            },

            {
                title: 'Publicis Sapient PI',
                start: new Date('08-26-2019'),
                className: 'bg-info'
            },
            {
                title: 'Capgemini Test',
                start: new Date('08-26-2019'),
                className: 'bg-info'
            },
            {
                title: 'IBM Test',
                start: new Date('08-26-2019'),
                className: 'bg-info'
            },

            {
                title: 'Delhivery',
                start: new Date('08-27-2019'),
                className: 'bg-info'
            },
            {
                title: 'IBM PI',
                start: new Date('08-27-2019'),
                className: 'bg-info'
            },

            {
                title: 'Capgemini PI',
                start: new Date('08-28-2019'),
                className: 'bg-info'
            },
            {
                title: 'GEP Solutions',
                start: new Date('08-28-2019'),
                className: 'bg-info'
            },

            {
                title: 'Droom',
                start: new Date('08-29-2019'),
                className: 'bg-info'
            },
            {
                title: 'KarMic',
                start: new Date('08-29-2019'),
                className: 'bg-info'
            },

            {
                title: 'Addverb Test',
                start: new Date('08-30-2019'),
                className: 'bg-info'
            },
            {
                title: 'Technip',
                start: new Date('08-30-2019'),
                className: 'bg-info'
            },

            {
                title: 'Addverb PI',
                start: new Date('08-31-2019'),
                className: 'bg-info'
            },
            {
                title: 'Jaro Education',
                start: new Date('08-31-2019'),
                className: 'bg-info'
            }];

        var $this = this;
        $this.$calendarObj = $this.$calendar.fullCalendar({
            slotDuration: '00:15:00', /* If we want to split day time each 15minutes */
            minTime: '08:00:00',
            maxTime: '19:00:00',  
            defaultView: 'month',  
            handleWindowResize: true,   
             
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            events: defaultEvents,
            editable: false,
            droppable: false, // this allows things to be dropped onto the calendar !!!
            eventLimit: false, // allow "more" link when too many events
            selectable: true,
            drop: function(date) { $this.onDrop($(this), date); },
            select: function (start, end, allDay) { $this.onSelect(start, end, allDay); },
            eventClick: function(calEvent, jsEvent, view) { $this.onEventClick(calEvent, jsEvent, view); }

        });

        //on new event
        this.$saveCategoryBtn.on('click', function(){
            var categoryName = $this.$categoryForm.find("input[name='category-name']").val();
            var categoryColor = $this.$categoryForm.find("select[name='category-color']").val();
            if (categoryName !== null && categoryName.length != 0) {
                $this.$extEvents.append('<div class="calendar-events" data-class="bg-' + categoryColor + '" style="position: relative;"><i class="fa fa-circle text-' + categoryColor + '"></i>' + categoryName + '</div>')
                //$this.enableDrag();
            }

        });
    },

   //init CalendarApp
    $.CalendarApp = new CalendarApp, $.CalendarApp.Constructor = CalendarApp
    
}(window.jQuery),

//initializing CalendarApp
function($) {
    "use strict";
    $.CalendarApp.init()
}(window.jQuery);
