import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://moukqztzsjvtzgethhlo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdWtxenR6c2p2dHpnZXRoaGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjYyNTEsImV4cCI6MjA4MTY0MjI1MX0.AsndiRQsi_Scz9RAMFtiEa5FNEYY-ZznDqgjQuEk3uA'
)
