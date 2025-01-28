use anchor_lang::prelude::*;

declare_id!("DyPwvtAcL7utnYfmVSVRXCyiirE8CTWLvu3ogidrHBLY");

#[program]
pub mod escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
