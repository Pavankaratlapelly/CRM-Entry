import api from "./hr.api";

export const generateDailyAttendance = () =>
  api.post("/Attendance/daily");

export const checkIn = (employeeId) =>
  api.post("/Attendance/check-in", null, {
    params: { employeeId },
  });

export const checkOut = (employeeId) =>
  api.post("/Attendance/check-out", null, {
    params: { employeeId },
  });

export const getTodayAttendance = () =>
  api.get("/Attendance/today");

export const updateAttendance = (employeeId, status) =>
  api.put("/Attendance/update", null, {
    params: { employeeId, status },
  });

export const getTotalHours = (employeeId) =>
  api.get("/Attendance/total-hours", {
    params: { employeeId },
  });
