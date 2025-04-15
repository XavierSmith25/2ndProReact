import './fullcalendar.css';
import React, { useEffect,  useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import caxios from '../../Utils/caxios';
import rStyle from './MettingRoom.module.css';
import InputResev from './InputResv';
import ResvDetail from './ResvDetail';
import koLocale from '@fullcalendar/core/locales/ko';





const MeetingRoom = ()=> {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [ resouceList, setResourceList ] = useState([]);
    const [ targetResc, setTargetResc ] = useState(0);
    const [ reservations, setReservations ] = useState([]);

    const handleDateSelect = (selectInfo) => {
        setSelectedInfo(selectInfo);
        setIsModalOpen(true);
      };

    useEffect(() => {
        
        caxios.get(`/reserve/resources`).then((resp)=>{
            setResourceList(resp.data);
        }).catch((error) => {
            console.error("자원 정보 불러오기 실패", error);
        })
        

        setReservations([]); 
        caxios.get(`/reserve/reservations`).then((resp) => {
            console.log("🔥 서버에서 받아온 예약 목록 원본:", resp.data);
          
            const fixDate = (dateStr) => dateStr.replace(/[./]/g, '-');
          
            const formatResev = resp.data.map((resv) => {
              const startStr = `${fixDate(resv.resv_date)}T${resv.resv_stime}`;
              const endStr = `${fixDate(resv.resv_date)}T${resv.resv_etime}`;
              const startDate = new Date(startStr);
              const endDate = new Date(endStr);
          
               return {
                id: resv.resv_id,
                title: resv.resv_title,
                start: startStr,
                end: endStr,
                allDay: false,
                overlap: false,
                extendedProps: {
                  emp_id: resv.resv_emp,
                  resource_id: resv.resource_id
                }
              };
            });
          
            setReservations(formatResev);
          }).catch((error) => {
            console.error("예약목록 불러오기 실패", error);
          });
      
    }, [])
    
    const [showWeekends, setShowWeekends] = useState(true);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [ selectedResv , setSeletedResv] = useState(null); 
    const selectResv = (clickInfo) => {
        
        setSeletedResv(clickInfo.event);
        console.log(selectedResv);
        setIsDetailOpen(true);
    };

    return (
        <div>
        <div className={rStyle.reservTable}>
            <div>
                회의실 예약 현황 조회
                <br></br>
                <select onChange={(e) => setTargetResc(e.target.value)}>
                    <option value="">자원선택</option>
                    {resouceList
                    .filter((resource)=>{
                        if(resource.resc_type_id != 110){
                            return resource.resc_type;
                        }
                        return true;
                    })
                    .map((resc, index) => (
                        <option key={index} value={resc.resc_id}>
                        {resc.resc_name}
                        </option>
                    ))}
                </select>
                
            </div>
            <div>
            <table className={rStyle.infoTable}>
                <thead>
                    <tr>
                    <th>수용인원</th>
                    <th>위치</th>
                    <th>사용 가능 여부</th>
                    <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        resouceList
                        .filter((resource) => resource.resc_id == targetResc)
                        .map((resource, index) => (
                            <tr key={index}>
                                <td>{resource.resc_capacity}</td>
                                <td>{resource.resc_location}</td>
                                <td>{resource.resc_status}</td>
                                <td>{resource.resc_description}</td>
                            </tr>
                        ))
                    }
                </tbody>
                </table>
            </div>
            
        <div>
            <FullCalendar
            key={targetResc} 
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            allDaySlot={false} 
            initialView='timeGridDay'
            slotMinTime="08:00:00"
            slotMaxTime="21:00:00"
            slotDuration="00:30:00"
            locales={[koLocale]}
            locale="ko"
            titleFormat={{
                month: 'long', // 예: 4월
                day: 'numeric', // 예: 14
                weekday: 'short' // 예: 월
            }}
            customButtons={{
                toggleWeekend: {
                  text: showWeekends ? '주말 숨기기' : '주말 보이기',
                  click: () => setShowWeekends(prev => !prev)
                }
            }}
            headerToolbar={{
                left: 'prev next',
                center: 'title',
                right: 'toggleWeekend'
            }}
            weekends={showWeekends}
            height='auto'
            selectable={true}
            selectMirror={true}
            select={handleDateSelect}
            events={reservations.filter(resv => resv.extendedProps.resource_id == Number(targetResc))}
            eventClick={selectResv}
            />
            </div>
        </div>
        {isModalOpen && (<InputResev closeModal={() => setIsModalOpen(false)} selectedInfo={selectedInfo} resourceId={targetResc}/>)}

        {isDetailOpen && (<ResvDetail selectedResv={selectedResv} closeDetail={() => setIsDetailOpen(false)} />)}
        
        </div>
    )
};


export default MeetingRoom;