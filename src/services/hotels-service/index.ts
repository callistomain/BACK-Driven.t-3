import { badRequestError, notFoundError, paymentRequiredError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";

// FIND ========================================================================

async function getAll(userId: number) {
  await paymentCheck(userId);
  return await hotelsRepository.findAll();
}

async function getHotelById(id: number, userId: number) {
  if (isNaN(id)) throw badRequestError();
  await paymentCheck(userId);
  const hotel = await hotelsRepository.findById(id);
  if (!hotel) throw notFoundError();

  return hotel;
}

// HELPERS =====================================================================

async function paymentCheck(userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== "PAID") throw paymentRequiredError();
  const restraints = (ticket.TicketType.isRemote || ticket.TicketType.includesHotel === false);
  if (restraints) throw paymentRequiredError();
}

// EXPORT ======================================================================

const hotelsService = {
  getAll,
  getHotelById
};

export default hotelsService;
