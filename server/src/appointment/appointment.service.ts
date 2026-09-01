import { Injectable } from '@nestjs/common';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientIdCard: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

@Injectable()
export class AppointmentService {
  private appointments: Appointment[] = [];

  create(data: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment {
    const appointment: Appointment = {
      ...data,
      id: 'APT' + Date.now().toString().slice(-8),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    this.appointments.push(appointment);
    return appointment;
  }

  findAll(): Appointment[] {
    return [...this.appointments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  findByPhone(phone: string): Appointment[] {
    return this.appointments
      .filter((a) => a.patientPhone === phone)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  cancel(id: string): Appointment | null {
    const apt = this.appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = 'cancelled';
    }
    return apt || null;
  }

  getStats() {
    const total = this.appointments.length;
    const confirmed = this.appointments.filter((a) => a.status === 'confirmed').length;
    const cancelled = this.appointments.filter((a) => a.status === 'cancelled').length;
    return { total, confirmed, cancelled };
  }
}
