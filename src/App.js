import moment from 'moment'
import { useEffect, useState } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'

import { database } from '../src/services/firebase'

import './App.css'

function App() {
  const [datas, setDatas] = useState([
    //{ date: '2021-07-29' },
    //{ date: '2021-07-30' }
  ])

  const [exist, setExist] = useState()

  useEffect(() => {
    const datesReef = database.ref('dates')

    datesReef.on('value', data => {
      const databaseDate = data.val() //object
      const allDates = []

      try {
        Object.entries(databaseDate).map(([id, object]) => {
          allDates.push({ date: object.date })
          if (object.date === dateOfDay()) {
            setExist(true)
          } else {
            setExist(false)
          }
        })
        setDatas(allDates)
      } catch {
        alert(
          'Se esta vendo isso é por que no BD não tem registro de datas, então vou adicionar agora uma data no banco (2021-07-31)'
        )
        datesReef.push({
          date: '2021-07-31'
        })
      }
    })
  }, [exist])

  function dateOfDay() {
    let date = new Date()
    let dateFormated = moment(date).format('YYYY-MM-DD') //YYYY-MM-DD
    return dateFormated
  }

  async function addedDate() {
    const datesReef = database.ref('dates')

    if (exist === false) {
      await datesReef.push({
        date: dateOfDay()
      })
      setExist(true)
    }
  }

  return (
    <div className="App">
      <h1>Historic of Study English Language per day</h1>
      <p>Data incio: 01/07/2021 | Data Fim: 30/04/2022</p>

      <div className="button">
        {exist ? (
          <h3>Parabéns por ter estudado hoje!</h3>
        ) : (
          <button onClick={addedDate}>Estudou hoje ?</button>
        )}
      </div>

      <div className="calendar">
        <CalendarHeatmap
          horizontal
          showOutOfRangeDays={false}
          showWeekdayLabels
          startDate={new Date('2021-07-01')}
          endDate={new Date('2022-04-30')}
          values={datas}
        />
      </div>
    </div>
  )
}

export default App
