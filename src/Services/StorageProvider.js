import localforage from 'localforage'

localforage.config({
    driver: [localforage.LOCALSTORAGE, localforage.INDEXEDDB],
    name: 'unijobs',
    storeName: 'unijobs_keys'
})

export default localforage