import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";

// FIND ========================================================================

async function getAll(userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const restraints = (ticket.status !== "PAID" || !ticket.TicketType.includesHotel);
  if (restraints) throw unauthorizedError();

  return await hotelsRepository.findAll();
}

async function getHotelById(id: number) {
  return await hotelsRepository.findById(id);
}

// EXPORT ======================================================================

const hotelsService = {
  getAll,
  getHotelById
};

export default hotelsService;
