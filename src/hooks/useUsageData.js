import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';

export function useUsageData() {
  const [data, setData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [creditLimit, setCreditLimit] = useState(50000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Listen to Usage Records
    const qData = query(collection(db, 'usage_records'), orderBy('createdAt', 'desc'));
    const unsubscribeData = onSnapshot(qData, (snapshot) => {
      const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(records);
    }, (err) => setError(err.message));

    // Listen to Payments
    const qPayments = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
    const unsubscribePayments = onSnapshot(qPayments, (snapshot) => {
      const paymentRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayments(paymentRecords);
    }, (err) => setError(err.message));

    // Listen to Credit Limit
    const unsubscribeLimit = onSnapshot(doc(db, 'settings', 'creditLimit'), (docSnap) => {
      if (docSnap.exists()) {
        setCreditLimit(docSnap.data().value);
      } else {
        // Initialize if it doesn't exist
        setDoc(doc(db, 'settings', 'creditLimit'), { value: 50000 });
      }
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => {
      unsubscribeData();
      unsubscribePayments();
      unsubscribeLimit();
    };
  }, []);

  const addRecord = async (record) => {
    try {
      await addDoc(collection(db, 'usage_records'), {
        ...record,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error adding record: ", err);
      setError(err.message);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await deleteDoc(doc(db, 'usage_records', id));
    } catch (err) {
      console.error("Error deleting record: ", err);
      setError(err.message);
    }
  };

  const addPayment = async (payment) => {
    try {
      await addDoc(collection(db, 'payments'), {
        ...payment,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error adding payment: ", err);
      setError(err.message);
    }
  };

  const deletePayment = async (id) => {
    try {
      await deleteDoc(doc(db, 'payments', id));
    } catch (err) {
      console.error("Error deleting payment: ", err);
      setError(err.message);
    }
  };

  const updateCreditLimit = async (limit) => {
    try {
      await setDoc(doc(db, 'settings', 'creditLimit'), { value: parseFloat(limit) });
    } catch (err) {
      console.error("Error updating credit limit: ", err);
      setError(err.message);
    }
  };

  return { 
    data, addRecord, deleteRecord,
    payments, addPayment, deletePayment,
    creditLimit, updateCreditLimit,
    loading, error
  };
}
