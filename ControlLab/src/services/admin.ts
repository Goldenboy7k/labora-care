import { supabase } from "@/integrations/supabase/client";

export async function getPendingTechnicians() {
  const { data, error } = await supabase
    .from("technician_requests")
    .select(`
      id,
      user_id,
      profiles (
        full_name
      )
    `)
    .eq("status", "pendente");

  if (error) throw error;
  return data;
}

export async function approveTechnician(requestId: string) {
  const { error } = await supabase.rpc("approve_technician", {
    request_id: requestId,
  });

  if (error) throw error;
}

export async function rejectTechnician(requestId: string) {
  const { error } = await supabase.rpc("reject_technician", {
    request_id: requestId,
  });

  if (error) throw error;
}