import { Suspense, useEffect } from 'react'

const newS = () => {
  let p: Promise<string> | string | undefined = undefined
  return () => {
    if (p === undefined) {
      p = new Promise((resolve) => {
        setTimeout(() => {
          resolve('done')
          console.log('resolved')
        }, 10)
      }).then(() => {p = 'done'})
      throw p
    } else if (p instanceof Promise) {
      throw p
    } else {
      return p
    }
  }
}

const map = {}

const lazyNews = (key: string) => {
  if (map[key]) {
    return map[key]
  }
  map[key] = newS()
  console.log('map', map)
  return map[key]
}

const P = ({children}) => {
  const s = lazyNews('P')()
  useEffect(() => {
    console.log('parent component useEffect called')
  }, [])
  return <div>{s}{children}</div>
}

const C = () => {
  const s = lazyNews('C')()
  useEffect(() => {
    console.log('children component useEffect called')
  }, [])
  return <div>{s}</div>
}

// この場合children -> parentになる
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <P><Suspense><C/></Suspense></P>
    </Suspense>
  )
}

// この場合parent -> childrenになる
function App2() {
  return (
    <P><Suspense><C/></Suspense></P>
  )
}

export default App
