use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;
use anchor_spl::token_interface::TokenAccount;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::TokenInterface;
use anchor_spl::token_interface::TransferChecked;
use anchor_spl::token_interface::transfer_checked;
use anchor_spl::token_interface::CloseAccount;
use anchor_spl::token_interface::close_account;
use crate::state::Escrow;

#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct Refund<'info> {
    #[account(mut,address=escrow.maker)]
    pub maker: Signer<'info>,
    #[account(address=escrow.mint_a)]
    pub mint_a: InterfaceAccount<'info, Mint>,
    #[account(address=escrow.mint_b)]
    pub mint_b: InterfaceAccount<'info, Mint>,
    #[account(
        mut, 
        associated_token::mint=mint_a,
        associated_token::authority=maker
    )]
    pub maker_mint_a_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        close=maker,  
        seeds=[b"escrow",maker.key.as_ref(),escrow.seed.to_le_bytes().as_ref()],
        bump=escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        associated_token::mint=mint_a,
        associated_token::authority=escrow,
     
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub system_program:Program<'info, System>,
    pub associated_token_program:Program<'info,AssociatedToken>,
    pub token_program:Interface<'info, TokenInterface>,
}

impl<'info> Refund<'info> {
  
    pub fn withdraw(&mut self)->Result<()>{
        let cpi_program = self.token_program.to_account_info();
        let cpi_account = TransferChecked{
            to:self.maker_mint_a_ata.to_account_info(),
            mint:self.mint_a.to_account_info(),
            from:self.vault.to_account_info(),
            authority:self.escrow.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);
        transfer_checked(cpi_ctx, self.vault.amount, self.mint_a.decimals)?;
        Ok(())
    }
    pub fn close(&mut self)->Result<()>{
        let cpi_program = self.token_program.to_account_info();
        let cpi_account = CloseAccount{
            account: self.vault.to_account_info(),
            destination: self.maker.to_account_info(),
            authority: self.escrow.to_account_info(),
        };
        let seed_binding=self.escrow.seed.to_le_bytes();
        let maker_binding=self.escrow.maker.to_bytes();
        let bump_binding = self.escrow.bump;

        let seeds:[&[u8];4]=[b"escrow",&seed_binding,&maker_binding,&[bump_binding]];
        let signer_seeds = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_account,signer_seeds);
        close_account(cpi_ctx)?;
        Ok(())
    }
}
