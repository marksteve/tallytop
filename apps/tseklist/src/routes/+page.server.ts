import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
  url,
  locals: { supabase, getSession },
}) => {
  const session = await getSession()
  const { data: tseks } = await supabase
    .from('tseklist_tseks')
    .select('*')
    .eq('user_id', session?.user.id)
  return { url: url.origin, tseks }
}
