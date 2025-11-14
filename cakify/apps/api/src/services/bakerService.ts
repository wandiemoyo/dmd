import type { SupabaseClient } from "@supabase/supabase-js";
import { Baker, Cake } from "@cakify/types";
import { HttpError } from "../middleware/errorHandler";

export class BakerService {
  constructor(private readonly client: SupabaseClient) {}

  async listBakers() {
    const { data, error } = await this.client
      .from("bakers")
      .select("*, cakes(*)")
      .limit(50);

    if (error) {
      throw new HttpError(500, error.message, error);
    }

    return data.map(mapBaker);
  }

  async getBaker(id: string) {
    const { data, error } = await this.client.from("bakers").select("*, cakes(*)").eq("id", id).single();
    if (error) {
      if (error.code === "PGRST116") {
        throw new HttpError(404, "Baker not found");
      }
      throw new HttpError(500, error.message, error);
    }
    return mapBaker(data);
  }

  async getBakerCakes(id: string) {
    const { data, error } = await this.client.from("cakes").select("*").eq("baker_id", id);
    if (error) {
      throw new HttpError(500, error.message, error);
    }
    return data.map(mapCake);
  }
}

const mapBaker = (row: any): Baker & { cakes: Cake[] } => ({
  id: row.id,
  name: row.name,
  businessName: row.business_name,
  description: row.description,
  rating: row.rating,
  deliveryRadiusKm: row.delivery_radius_km,
  minLeadTimeHours: row.min_lead_time_hours,
  avatarUrl: row.avatar_url,
  heroImageUrl: row.hero_image_url,
  location: row.location,
  specialties: row.specialties ?? [],
  isVerified: row.is_verified,
  cakes: (row.cakes ?? []).map(mapCake)
});

const mapCake = (row: any): Cake => ({
  id: row.id,
  bakerId: row.baker_id,
  title: row.title,
  description: row.description,
  price: row.price,
  currency: row.currency,
  photoUrl: row.photo_url,
  prepTimeMinutes: row.prep_time_minutes,
  tags: row.tags ?? [],
  isFeatured: row.is_featured
});
