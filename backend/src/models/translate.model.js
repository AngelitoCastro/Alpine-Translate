import { supabase } from "../libs/supabase.js";

export class TranslateModel {
  static async create(traduction) {
    return supabase.from("translations").insert(traduction).select("*").single();
  }

  static async list() {
    return supabase.from("translations").select("*");
  }

  static async remove(id) {
    return supabase.from("translations").delete().eq("id", id);
  }

  static async update(id, payload) {
    return supabase
      .from("translations")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();
  }
}
